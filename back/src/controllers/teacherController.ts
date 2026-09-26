import { Request, Response } from "express";
import Teacher from "../models/Teacher";

export const createTeacher = async (
  req: Request,
  res: Response
) => {
  try {
    const teacher = await Teacher.create(req.body);

    res.status(201).json({
      message: "Teacher added successfully",
      teacher,
    });
  } catch (error) {
    console.error("Create teacher error:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create teacher",
    });
  }
};

export const getTeachers = async (
  req: Request,
  res: Response
) => {
  try {
    const teachers = await Teacher.find()
      .populate("courses");

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Get teachers error:", error);

    res.status(500).json({
      message: "Failed to fetch teachers",
    });
  }
};