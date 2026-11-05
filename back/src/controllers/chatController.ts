import { Request, Response } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";
import mongoose from "mongoose";
import { getIO } from "../socket";

const emitToUser = (userId: string, event: string, payload: unknown) => {
  try {
    getIO().to(`user:${userId}`).emit(event, payload);
  } catch (error) {
    console.error("SOCKET EMIT ERROR:", error);
  }
};

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
  }).sort({ pinned: -1, updatedAt: -1 });

  res.json(chats);
};

// Rename chat / pin / favorite / archive
export const renameChat = async (req: Request, res: Response) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.chatId as string);
    const { title, pinned, favorite, archived } = req.body;

    const updates: Record<string, unknown> = {};

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({
          message: "Chat title is required",
        });
      }

      updates.title = String(title).trim().slice(0, 50);
    }

    for (const [key, value] of Object.entries({
      pinned,
      favorite,
      archived,
    })) {
      if (typeof value === "boolean") {
        updates[key] = value;
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        userId: req.user.id,
      },
      {
        $set: updates,
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

    emitToUser(req.user.id, "chat:updated", chat);

    res.json(chat);
  } catch (error) {
    console.error("RENAME CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to rename chat",
    });
  }
};

// Clear all messages in a chat
export const clearChat = async (req: Request, res: Response) => {
  try {
    const chatId = new mongoose.Types.ObjectId(req.params.chatId as string);

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: req.user.id },
      { $set: { title: "New Chat" } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    await Message.deleteMany({ chatId });

    try {
      getIO().to(`chat:${chatId.toString()}`).emit("chat:cleared", {
        chatId: chatId.toString(),
      });
    } catch (error) {
      console.error("SOCKET EMIT ERROR:", error);
    }

    emitToUser(req.user.id, "chat:cleared", { chatId: chatId.toString() });
    emitToUser(req.user.id, "chat:updated", chat);

    res.json(chat);
  } catch (error) {
    console.error("CLEAR CHAT ERROR:", error);

    res.status(500).json({
      message: "Failed to clear chat",
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

    emitToUser(req.user.id, "chat:deleted", { chatId: chatId.toString() });

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
