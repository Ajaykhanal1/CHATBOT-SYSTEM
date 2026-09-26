import { Request, Response } from "express";

import Student from "../models/Student";
import { User } from "../models/user.model";

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

        // Check required email
        if (!email) {
            return res.status(400).json({
                message: "Student email is required",
            });
        }

        // Find existing User by email
        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(404).json({
                message:
                    "No user account found with this email",
            });
        }

        // Create Student and connect User
        const student = await Student.create({
            user: user._id,
            name,
            email: email.toLowerCase().trim(),
            rollNumber,
            semester,
            gpa,
            courses,
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
                    "Student already exists or this User is already linked to a Student",
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