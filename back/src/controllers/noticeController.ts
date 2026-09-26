import { Request, Response } from "express";
import Notice from "../models/Notice";

// Create Notice
export const createNotice = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, content, publishedAt } = req.body;

    const notice = await Notice.create({
      title,
      content,
      publishedAt: publishedAt || new Date(),
    });

    res.status(201).json({
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    console.error("Create notice error:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create notice",
    });
  }
};

// Get All Notices
export const getNotices = async (
  req: Request,
  res: Response
) => {
  try {
    const notices = await Notice.find().sort({
      publishedAt: -1,
    });

    res.status(200).json(notices);
  } catch (error) {
    console.error("Get notices error:", error);

    res.status(500).json({
      message: "Failed to fetch notices",
    });
  }
};

// Get Single Notice
export const getNoticeById = async (
  req: Request,
  res: Response
) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error("Get notice error:", error);

    res.status(500).json({
      message: "Failed to fetch notice",
    });
  }
};

// Update Notice
export const updateNotice = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, content, publishedAt } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        publishedAt,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      message: "Notice updated successfully",
      notice,
    });
  } catch (error) {
    console.error("Update notice error:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update notice",
    });
  }
};

// Delete Notice
export const deleteNotice = async (
  req: Request,
  res: Response
) => {
  try {
    const notice = await Notice.findByIdAndDelete(
      req.params.id
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete notice error:", error);

    res.status(500).json({
      message: "Failed to delete notice",
    });
  }
};