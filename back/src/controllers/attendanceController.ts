import { Request, Response } from "express";
import Attendance from "../models/Attendance";
import {
  createAttendanceSchema,
  zodMessage,
} from "../validators/admin.validator";

export const createAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const result = createAttendanceSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: zodMessage(result.error),
      });
    }

    const attendance = await Attendance.create(result.data);

    res.status(201).json({
      message: "Attendance added successfully",
      attendance,
    });
  } catch (error) {
    console.error("Create attendance error:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to add attendance",
    });
  }
};

export const getAttendances = async (
  req: Request,
  res: Response
) => {
  try {
    const attendances = await Attendance.find()
      .populate("student");

    res.status(200).json(attendances);
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      message: "Failed to fetch attendance",
    });
  }
};