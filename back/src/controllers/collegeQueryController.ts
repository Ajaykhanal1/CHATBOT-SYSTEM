import { Request, Response } from "express";
import { getStudentByName } from "../services/collegeQueryService";
import {
  detectQuestionType,
  extractStudentName,
} from "../services/questionParser";

export const testQuestion = async (
  req: Request<
    {},
    {},
    {
      question?: string;
      questions?: string[];
    }
  >,
  res: Response
) => {
  try {
    const questions = req.body.questions
      ? req.body.questions
      : req.body.question
        ? [req.body.question]
        : [];

    if (!questions.length) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const answers = [];

    for (const question of questions) {
      const type = detectQuestionType(question);
      const studentName = extractStudentName(question);

      if (!studentName) {
        answers.push({
          question,
          answer: "Student name not found",
        });
        continue;
      }

      const result = await getStudentByName(studentName);

      if (!result) {
        answers.push({
          question,
          answer: "Student not found",
        });
        continue;
      }

      if (type === "gpa") {
        answers.push({
          question,
          answer: `${result.student.name}'s GPA is ${result.student.gpa}.`,
        });
        continue;
      }

      if (type === "attendance") {
        answers.push({
          question,
          answer: result.attendance.map((item) => ({
            semester: item.semester,
            attendance_percentage: item.attendance_percentage,
          })),
        });
        continue;
      }

      if (type === "courses") {
        answers.push({
          question,
          answer: result.student.courses.map((course: any) => ({
            code: course.code,
            name: course.name,
            semester: course.semester,
            faculty: course.faculty,
          })),
        });
        continue;
      }

      if (type === "teacher") {
        answers.push({
          question,
          answer: result.student.courses.map((course: any) => ({
            course: course.name,
            teacher: course.teacher
              ? {
                  name: course.teacher.name,
                  email: course.teacher.email,
                }
              : null,
          })),
        });
        continue;
      }

      if (type === "student") {
        answers.push({
          question,
          answer: {
            name: result.student.name,
            email: result.student.email,
            rollNumber: result.student.rollNumber,
            semester: result.student.semester,
            gpa: result.student.gpa,
          },
        });
        continue;
      }

      answers.push({
        question,
        answer: "I don't understand this question yet.",
      });
    }

    return res.json({ answers });
  } catch (error) {
    console.error("Question query error:", error);

    return res.status(500).json({
      message: "Failed to process question",
    });
  }
};