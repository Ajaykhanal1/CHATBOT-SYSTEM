import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import mongoose from "mongoose";

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
      chat: updatedChat,
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to send message",
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
