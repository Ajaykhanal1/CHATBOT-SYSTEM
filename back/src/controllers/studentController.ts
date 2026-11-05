import { Request, Response } from "express";

import Student from "../models/Student";

export const createStudent = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            name,
            email,
            rollNumber,
            semester,
            gpa,
            courses,
        } = req.body;

        const normalizedEmail = String(email ?? "")
            .toLowerCase()
            .trim();

        if (!normalizedEmail) {
            return res.status(400).json({
                message: "Student email is required",
            });
        }

        // Admin-created students are independent of any User account.
        // A User is linked later when the student registers.
        const student = await Student.create({
            name,
            email: normalizedEmail,
            rollNumber,
            semester,
            gpa,
            courses: Array.isArray(courses)
                ? courses
                : courses
                ? [courses]
                : [],
            picture: req.file
                ? `/uploads/${req.file.filename}`
                : undefined,
        });

        return res.status(201).json({
            message: "Student added successfully",
            student,
        });
    } catch (error: unknown) {
        console.error("Create student error:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            return res.status(409).json({
                message:
                    "A student with this email or roll number already exists",
            });
        }

        return res.status(500).json({
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
        const students = await Student.find()
            .populate("user", "name email role")
            .populate({
                path: "courses",
                populate: {
                    path: "teacher",
                },
            });

        return res.json(students);
    } catch (error) {
        console.error("Get students error:", error);

        return res.status(500).json({
            message: "Failed to fetch students",
        });
    }
};