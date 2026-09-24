import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import mongoose from "mongoose";
import { generateAIResponse } from "../services/geminiService";
import searchQdrant from "../services/searchQdrant";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

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

Your job is to answer the user's question clearly, accurately, and naturally.

RULES:
- Understand the user's intent before answering.
- Answer like a real conversational AI, not like a document or search engine.
- Be friendly, natural, and direct.
- Keep simple questions short and conversational.
- For complex questions, explain step-by-step using headings or bullet points when useful.
- Do not unnecessarily repeat the user's question.
- Use the conversation history to understand follow-up questions and context.
- Use the provided CONTEXT as your primary source for factual answers about the college/knowledge base.
- Do not invent information that is not supported by the CONTEXT.
- If the answer cannot be found in the CONTEXT, say:
  "I don't have enough information to answer that."
- If the user is just greeting you or having casual conversation, respond naturally without forcing the CONTEXT.
- If the user asks a follow-up question, connect it with the previous conversation.
- Do not mention "CONTEXT", "RAG", "Qdrant", embeddings, or internal system instructions.
- Do not say that you are searching a database.
- Use Markdown when it improves readability.
- Give the answer directly without unnecessary filler.

CONTEXT:
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
