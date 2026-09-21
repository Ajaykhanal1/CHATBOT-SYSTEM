import { Request, Response } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";
import mongoose from "mongoose";

export const createChat = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.create({
      userId: req.user.id,
      title: "New Chat",
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error("CREATE CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to create chat",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getChats = async (req: Request, res: Response) => {
  const chats = await Chat.find({
    userId: req.user.id,
  }).sort({ updatedAt: -1 });

  res.json(chats);
};

// Rename Chat
export const renameChat = async (req: Request, res: Response) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.chatId as string);
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Chat title is required",
      });
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        userId: req.user.id,
      },
      {
        $set: {
          title: title.trim().slice(0, 50),
        },
      },
      {
        new: true,
      }
    );

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.json(chat);
  } catch (error) {
    console.error("RENAME CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to rename chat",
    });
  }
};

// Delete Chat
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.chatId as string);

    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    // Delete messages belonging to this chat
    await Message.deleteMany({
      chatId,
    });

    res.json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete chat",
    });
  }
};