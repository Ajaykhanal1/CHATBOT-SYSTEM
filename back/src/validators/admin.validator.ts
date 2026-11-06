import { z } from "zod";

const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid selection");

const optionalObjectId = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  objectId.optional(),
);

const requiredObjectId = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .regex(/^[a-f\d]{24}$/i, `Invalid ${label.toLowerCase()} selection`);

const requiredNumber = (
  label: string,
  min: number,
  max: number,
  integer = false,
) => {
  const schema = z.coerce
    .number({ error: `${label} is required` })
    .min(min, `${label} must be between ${min} and ${max}`)
    .max(max, `${label} must be between ${min} and ${max}`);

  return z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    integer ? schema.int(`${label} must be a whole number`) : schema,
  );
};

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address")
  .transform((value) => value.toLowerCase());

const faculty = z.string().trim().min(1, "Faculty is required");

export const createStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email,
  rollNumber: z
    .string()
    .trim()
    .min(1, "Roll number is required")
    .max(30, "Roll number is too long"),
  semester: requiredNumber("Semester", 1, 8, true),
  gpa: requiredNumber("GPA", 0, 4),
  faculty,
  courses: requiredObjectId("Course"),
});

export const createTeacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email,
  faculty,
  courses: requiredObjectId("Course"),
});

export const createCourseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Course code is required")
    .max(20, "Course code is too long"),
  name: z
    .string()
    .trim()
    .min(2, "Course name must be at least 2 characters")
    .max(150, "Course name is too long"),
  semester: requiredNumber("Semester", 1, 8, true),
  faculty,
  teacher: optionalObjectId,
});

export const createNoticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title is too long"),
  content: z
    .string()
    .trim()
    .min(1, "Notice content is required")
    .max(5000, "Notice content is too long"),
  publishedAt: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.date({ error: "Invalid publication date" }).optional(),
  ),
});

export const createAttendanceSchema = z.object({
  student: requiredObjectId("Student"),
  semester: requiredNumber("Semester", 1, 8, true),
  attendance_percentage: requiredNumber(
    "Attendance percentage",
    0,
    100,
  ),
});

export const zodMessage = (error: z.ZodError): string =>
  error.issues[0]?.message ?? "Invalid data";
