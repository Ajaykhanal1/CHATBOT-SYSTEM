import { Request, Response } from "express";
import Attendance from "../models/Attendance";

export const createAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const { student, attendance_percentage, semester } = req.body;

    const attendance = await Attendance.create({
      student,
      attendance_percentage,
      semester,
    });

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