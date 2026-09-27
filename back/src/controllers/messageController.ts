import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import mongoose from "mongoose";
import { generateAIResponse } from "../services/geminiService";
import searchQdrant from "../services/searchQdrant";
import { getStudentData } from "../services/structuredDataService";
import { parseQuestion } from "../services/questionParser";

import {
  getStudentCountBySemester,
  getStudentsBySemester,
  getTotalStudentCount,
  getStudentByName,
  getStudentAttendance,
  getAllTeachers,
  getLatestNotices,
} from "../services/collegeQueryService";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const studentData = await getStudentData(req.user.email);
    if (!content?.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }
// Parse question
const parsedQuestion = parseQuestion(content.trim());

console.log("PARSED QUESTION:", parsedQuestion);

// Query MongoDB based on question type
let databaseResult: unknown = null;

switch (parsedQuestion.type) {
  // ─────────────────────────────────────────────
  // Student Count
  // Example: How many students are in semester 2?
  // ─────────────────────────────────────────────
  case "student_count":
    if (parsedQuestion.semester !== undefined) {
      databaseResult = await getStudentCountBySemester(
        parsedQuestion.semester
      );
    } else {
      databaseResult = await getTotalStudentCount();
    }
    break;

  // ─────────────────────────────────────────────
  // Students By Semester
  // Example: Show students in semester 2
  // ─────────────────────────────────────────────
  case "students_by_semester":
    if (parsedQuestion.semester !== undefined) {
      databaseResult = await getStudentsBySemester(
        parsedQuestion.semester
      );
    }
    break;

  // ─────────────────────────────────────────────
  // GPA
  // Example: What is Ajay's GPA?
  // ─────────────────────────────────────────────
  case "gpa":
    if (parsedQuestion.studentName) {
      databaseResult = await getStudentByName(
        parsedQuestion.studentName
      );
    } else {
      databaseResult = await getStudentData(req.user.email);
    }
    break;

  // ─────────────────────────────────────────────
  // Attendance
  // Example: What is Ajay's attendance?
  // ─────────────────────────────────────────────
  case "attendance":
    if (parsedQuestion.studentName) {
      databaseResult = await getStudentAttendance(
        parsedQuestion.studentName
      );
    } else {
      databaseResult = await getStudentAttendance(
        req.user.email
      );
    }
    break;

  // ─────────────────────────────────────────────
  // Courses
  // Example: What courses does Ajay take?
  // ─────────────────────────────────────────────
  case "courses":
    if (parsedQuestion.studentName) {
      databaseResult = await getStudentByName(
        parsedQuestion.studentName
      );
    } else {
      databaseResult = await getStudentData(req.user.email);
    }
    break;

  // ─────────────────────────────────────────────
  // Teacher
  // Example: Who teaches Web Technology?
  // ─────────────────────────────────────────────
  case "teacher":
  case "teacher_info":
    if (parsedQuestion.studentName) {
      databaseResult = await getStudentByName(
        parsedQuestion.studentName
      );
    } else {
      databaseResult = await getAllTeachers();
    }
    break;

  // ─────────────────────────────────────────────
  // Notice
  // Example: Show latest notices
  // ─────────────────────────────────────────────
  case "notice":
    databaseResult = await getLatestNotices();
    break;

  // ─────────────────────────────────────────────
  // Student Information
  // Example: Tell me about Ajay
  // ─────────────────────────────────────────────
  case "student":
    if (parsedQuestion.studentName) {
      databaseResult = await getStudentByName(
        parsedQuestion.studentName
      );
    } else {
      databaseResult = await getStudentData(req.user.email);
    }
    break;

  // ─────────────────────────────────────────────
  // Unknown
  // ─────────────────────────────────────────────
  case "unknown":
  default:
    databaseResult = null;
    break;
}

console.log("DATABASE RESULT:", databaseResult);

    const chatId = new mongoose.Types.ObjectId(req.params.chatId as string);

    // Check that chat belongs to logged-in user
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    // Save user message
    const message = await Message.create({
      chatId,
      role: "user",
      content: content.trim(),
    });

    // Generate AI response

    // Get Previous messages for Prompt
    const previousMessages = await Message.find({
      chatId,
    }).sort({
      createdAt: 1,
    });

    const results = await searchQdrant(content.trim());
    const chunks = results.points
      .map((point) => point.payload?.text)
      .filter(Boolean);
    const context = chunks.join("\n\n");

    // Build Prompt with previous messages
    const conversation = previousMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `
You are MyChat AI, a smart, helpful, and natural conversational assistant.

Answer the CURRENT USER QUESTION using the available information below.

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

CURRENT USER QUESTION:
${content.trim()}

Answer naturally:
`;

    // Generate AI response using Gemini API
    const aiResponse = await generateAIResponse(prompt);

    // Save AI response
    await Message.create({
      chatId,
      role: "assistant",
      content: aiResponse,
    });

    // Use first message as chat title
    // First message → make chat permanent
    const update: any = {
      $unset: {
        expiresAt: 1,
      },
    };

    if (chat.title === "New Chat") {
      update.$set = { title: content.trim().slice(0, 50) };
    }

    const updatedChat = await Chat.findOneAndUpdate({ _id: chat._id }, update, {
      new: true,
    });

    res.status(201).json({
      message,
      aiResponse,
      chat: updatedChat,
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to send message",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.chatId as string);

    const messages = await Message.find({ chatId }).sort({
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
