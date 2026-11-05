import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import mongoose from "mongoose";
import {
  generateAIResponseStream,
  generateChatTitle,
} from "../services/geminiService";
import searchQdrant from "../services/searchQdrant";
import { getStudentData } from "../services/structuredDataService";
import { parseQuestion } from "../services/questionParser";
import { getIO } from "../socket";

import {
  getStudentCountBySemester,
  getStudentsBySemester,
  getTotalStudentCount,
  getStudentByName,
  getAllStudents,
  getStudentAttendance,
  getAllTeachers,
  getLatestNotices,
} from "../services/collegeQueryService";

const emitToUser = (userId: string, event: string, payload: unknown) => {
  try {
    getIO().to(`user:${userId}`).emit(event, payload);
  } catch (error) {
    console.error("SOCKET EMIT ERROR:", error);
  }
};

// Emit to the chat room and the user room so a freshly opened tab never misses
// the first stream events before it joins the chat room.
const emitChatEvent = (
  chatId: string,
  userId: string,
  event: string,
  payload: unknown
) => {
  try {
    // Chained rooms dedupe sockets that are in both rooms.
    getIO().to(`chat:${chatId}`).to(`user:${userId}`).emit(event, payload);
  } catch (error) {
    console.error("SOCKET EMIT ERROR:", error);
  }
};

const getOwnedChat = async (chatId: string, userId: string) => {
  if (!mongoose.isValidObjectId(chatId)) return null;

  return Chat.findOne({ _id: chatId, userId });
};

const getTeachersFromQuestion = async (question: string) => {
  const teachers = await getAllTeachers();
  const matches = teachers.filter((teacher: any) => {
    const name = String(teacher?.name ?? "").trim();

    if (!name) return false;

    const pattern = new RegExp(
      `\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i"
    );

    return pattern.test(question);
  });

  return matches;
};

const getStudentFromQuestion = async (question: string) => {
  const students = await getAllStudents();
  const student = students
    .filter(({ name }: any) => {
      const escapedName = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escapedName}\\b`, "i").test(question);
    })
    .sort((a: any, b: any) => b.name.length - a.name.length)[0];

  return student ? getStudentByName(student.name) : null;
};

const getDatabaseResult = async (question: string, email: string) => {
  const parsed = parseQuestion(question);

  switch (parsed.type) {
    case "student_count":
      return parsed.semester !== undefined
        ? getStudentCountBySemester(parsed.semester)
        : getTotalStudentCount();

    case "students_by_semester":
      return parsed.semester !== undefined
        ? getStudentsBySemester(parsed.semester)
        : null;

    case "gpa":
    case "courses":
    case "student":
      if (parsed.studentName) {
        const student = await getStudentByName(parsed.studentName);
        if (student) return student;
      }

      return (await getStudentFromQuestion(question)) ?? getStudentData(email);

    case "attendance":
      return getStudentAttendance(parsed.studentName || email);

    case "teacher":
    case "teacher_info":
      return getTeachersFromQuestion(question);

    case "notice":
      return getLatestNotices();

    default:
      return getStudentFromQuestion(question);
  }
};

const getPictures = (result: unknown): string[] => {
  const items = Array.isArray(result) ? result : result ? [result] : [];
  const pictures: string[] = [];

  for (const item of items) {
    const record =
      (item as { student?: { picture?: string } })?.student ?? item;
    const picture = (record as { picture?: string })?.picture;

    if (picture) pictures.push(picture);
  }

  return [...new Set(pictures)];
};

const buildPrompt = async (
  chatId: string,
  question: string,
  email: string
) => {
  const [previousMessages, results, databaseResult, studentData] =
    await Promise.all([
      Message.find({ chatId }).sort({ createdAt: 1 }),
      searchQdrant(question),
      getDatabaseResult(question, email),
      getStudentData(email),
    ]);

  const context = results.points
    .map((point: any) => point.payload?.text)
    .filter(Boolean)
    .join("\n\n");

  const conversation = previousMessages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const prompt = `
You are MyChat AI, a smart, helpful, and natural conversational assistant.

CURRENT USER QUESTION:
${question}

Answer the question using the available information below.

SOURCE PRIORITY:
1. DATABASE RESULT — use this first for structured college data such as:
   student count, students by semester, GPA, marks, attendance, courses, and teachers.
2. STRUCTURED DATA — use this for information about the currently logged-in student.
3. DOCUMENT CONTEXT — use this for information contained in college documents.
4. CONVERSATION — use this to understand previous messages and follow-up questions.

IMPORTANT RULES:
- If DATABASE RESULT contains the answer, use it directly.
- Do NOT require DATABASE RESULT information to also exist in DOCUMENT CONTEXT.
- If DATABASE RESULT is a number, array, object, or other valid result, treat it as reliable database information.
- If STRUCTURED DATA contains the requested personal information, use it.
- Use DOCUMENT CONTEXT only when the answer comes from documents.
- Never invent or guess information.
- If the required information is not available in any source, say:
  "I don't have enough information to answer that."
- Do not mention DATABASE RESULT, STRUCTURED DATA, DOCUMENT CONTEXT, Qdrant, RAG, embeddings, or internal instructions.
- Answer naturally like ChatGPT.
- Keep simple questions short and direct.
- Use Markdown only when it improves readability.
- Do not unnecessarily repeat the user's question.
- For casual conversation, respond naturally.

DATABASE RESULT:
${JSON.stringify(databaseResult, null, 2)}

STRUCTURED DATA:
${JSON.stringify(studentData, null, 2)}

DOCUMENT CONTEXT:
${context}

CONVERSATION:
${conversation}

Use the sources above to answer the question. Answer naturally:
`;

  return { prompt, images: getPictures(databaseResult) };
};

const startTitleGeneration = (chat: any, question: string) => {
  if (chat.title !== "New Chat") return;

  const chatId = chat._id.toString();
  const userId = chat.userId.toString();

  // Runs in the background so the answer is not delayed by title generation.
  generateChatTitle(question).then(async (title) => {
    if (!title) return;

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, title: "New Chat" },
      { $set: { title } },
      { new: true }
    );

    if (updatedChat) {
      emitChatEvent(chatId, userId, "chat:updated", updatedChat);
    }
  }).catch((error) => {
    console.error("TITLE UPDATE ERROR:", error);
  });
};

const streamReply = async (
  req: Request,
  res: Response,
  chat: any,
  userMessage: any
) => {
  const chatId = chat._id.toString();
  const userId = chat.userId.toString();
  const abort = new AbortController();

  const handleClose = () => {
    if (!res.writableEnded) abort.abort();
  };

  res.on("close", handleClose);

  emitChatEvent(chatId, userId, "message:start", { chatId });

  let answer = "";
  let images: string[] = [];

  try {
    const promptResult = await buildPrompt(
      chatId,
      userMessage.content,
      req.user.email
    );
    images = promptResult.images;

    const stream = generateAIResponseStream(promptResult.prompt, abort.signal);

    for await (const chunk of stream) {
      if (abort.signal.aborted) break;
      answer += chunk;
      emitChatEvent(chatId, userId, "message:chunk", { chatId, content: chunk });
    }
  } catch (error) {
    if (!abort.signal.aborted) {
      res.off("close", handleClose);
      throw error;
    }
  } finally {
    res.off("close", handleClose);
  }

  let aiMessage = null;

  if (answer.trim()) {
    aiMessage = await Message.create({
      chatId,
      role: "assistant",
      content: answer,
      images,
    });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $unset: { expiresAt: 1 } },
    { new: true }
  );

  emitChatEvent(chatId, userId, "message:done", {
    chatId,
    aiMessage,
    chat: updatedChat,
  });

  return { aiMessage, chat: updatedChat };
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const content = String(req.body?.content ?? "").trim();

    if (!content) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const chat = await getOwnedChat(req.params.chatId as string, req.user.id);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const userMessage = await Message.create({
      chatId: chat._id,
      role: "user",
      content,
    });

    // Keep the conversation as soon as it has a message, even if generation fails.
    await Chat.updateOne({ _id: chat._id }, { $unset: { expiresAt: 1 } });

    emitChatEvent(chat._id.toString(), req.user.id, "message:user", {
      chatId: chat._id.toString(),
      userMessage,
    });
    emitToUser(req.user.id, "chat:updated", {
      ...chat.toObject(),
      updatedAt: new Date(),
    });

    startTitleGeneration(chat, content);

    const result = await streamReply(req, res, chat, userMessage);

    if (!res.destroyed) {
      res.status(201).json({
        message: userMessage,
        aiResponse: result.aiMessage?.content ?? "",
        chat: result.chat,
      });
    }
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    emitChatEvent(
      String(req.params.chatId),
      req.user.id,
      "message:error",
      {
        chatId: String(req.params.chatId),
        message: "Failed to send message",
      }
    );

    if (!res.destroyed) {
      res.status(500).json({
        message: "Failed to send message",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
};

export const regenerateResponse = async (req: Request, res: Response) => {
  try {
    const chat = await getOwnedChat(req.params.chatId as string, req.user.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const lastUserMessage = await Message.findOne({
      chatId: chat._id,
      role: "user",
    }).sort({ createdAt: -1 });

    if (!lastUserMessage) {
      return res.status(400).json({ message: "No user message to regenerate" });
    }

    await Message.deleteMany({
      chatId: chat._id,
      _id: { $gt: lastUserMessage._id },
    });

    const result = await streamReply(req, res, chat, lastUserMessage);

    if (!res.destroyed) {
      res.status(201).json({
        aiResponse: result.aiMessage?.content ?? "",
        chat: result.chat,
      });
    }
  } catch (error) {
    console.error("REGENERATE ERROR:", error);

    emitChatEvent(
      String(req.params.chatId),
      req.user.id,
      "message:error",
      {
        chatId: String(req.params.chatId),
        message: "Failed to regenerate response",
      }
    );

    if (!res.destroyed) {
      res.status(500).json({ message: "Failed to regenerate response" });
    }
  }
};

export const editMessage = async (req: Request, res: Response) => {
  try {
    const content = String(req.body?.content ?? "").trim();

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const chat = await getOwnedChat(req.params.chatId as string, req.user.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await Message.findOne({
      _id: req.params.messageId,
      chatId: chat._id,
      role: "user",
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.content = content;
    await message.save();

    await Message.deleteMany({
      chatId: chat._id,
      _id: { $gt: message._id },
    });

    emitChatEvent(chat._id.toString(), req.user.id, "message:updated", {
      chatId: chat._id.toString(),
      message,
    });

    const result = await streamReply(req, res, chat, message);

    if (!res.destroyed) {
      res.json({
        message,
        aiResponse: result.aiMessage?.content ?? "",
        chat: result.chat,
      });
    }
  } catch (error) {
    console.error("EDIT MESSAGE ERROR:", error);

    emitChatEvent(
      String(req.params.chatId),
      req.user.id,
      "message:error",
      {
        chatId: String(req.params.chatId),
        message: "Failed to edit message",
      }
    );

    if (!res.destroyed) {
      res.status(500).json({ message: "Failed to edit message" });
    }
  }
};

export const setMessageFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = req.body?.feedback;

    if (feedback !== "like" && feedback !== "dislike" && feedback !== null) {
      return res.status(400).json({ message: "Invalid feedback" });
    }

    const chat = await getOwnedChat(req.params.chatId as string, req.user.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await Message.findOneAndUpdate(
      {
        _id: req.params.messageId,
        chatId: chat._id,
        role: "assistant",
      },
      { $set: { feedback } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("MESSAGE FEEDBACK ERROR:", error);
    res.status(500).json({ message: "Failed to save feedback" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const chat = await getOwnedChat(req.params.chatId as string, req.user.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chatId: chat._id }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);

    res.status(500).json({
      message: "Failed to get messages",
    });
  }
};
