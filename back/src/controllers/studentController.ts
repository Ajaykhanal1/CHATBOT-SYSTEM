import { Request, Response } from "express";
import Student from "../models/Student";

export const createStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    console.error("Create student error:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create student",
    });
  }
};

export const getStudents = async (
  req: Request,
  res: Response
) => {
  try {
    const students = await Student.find().populate("courses");

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};