import { Request, Response } from "express";
import Teacher from "../models/Teacher";
import {
  createTeacherSchema,
  zodMessage,
} from "../validators/admin.validator";

export const createTeacher = async (
  req: Request,
  res: Response
) => {
  try {
    const result = createTeacherSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: zodMessage(result.error),
      });
    }

    const { name, email, courses } = result.data;

    const teacher = await Teacher.create({
      name,
      email,
      courses: courses
        ? Array.isArray(courses)
          ? courses
          : [courses]
        : [],
      picture: req.file
        ? `/uploads/${req.file.filename}`
        : undefined,
    });

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