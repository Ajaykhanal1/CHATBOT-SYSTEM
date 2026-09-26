import { Request, Response } from "express";
import Course from "../models/Course";

export const createCourse = async (
    req: Request,
    res: Response
) => {
    try {
        const course = await Course.create(req.body);

        return res.status(201).json({
            message: "Course added successfully",
            course,
        });
    } catch (error: unknown) {
        console.error("Create course error:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            return res.status(409).json({
                message: "Course code already exists",
            });
        }

        return res.status(500).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create course",
        });
    }
};
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().populate("teacher");

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};
