"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { api } from "@/lib/axios/axios";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    studentSchema,
    toFieldErrors,
    type FieldErrors,
} from "@/lib/validations/admin";

interface Course {
    _id: string;
    name: string;
    faculty: string;
    semester: number;
}

export default function Student() {
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    const [faculty, setFaculty] = useState("");
    const [semester, setSemester] = useState("");

    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get("/admin/courses");
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        fetchCourses();
    }, []);

    // Show courses matching selected faculty AND semester
    const filteredCourses = courses.filter(
        (course) =>
            course.faculty === faculty &&
            course.semester === Number(semester)
    );

    const addStudent = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const result = studentSchema.safeParse(
            Object.fromEntries(formData)
        );

        if (!result.success) {
            setErrors(toFieldErrors(result.error));
            setMessage("Please fix the highlighted fields.");
            return;
        }

        setErrors({});

        try {
            setLoading(true);
            setMessage("");

            const { data } = await api.post(
                "/admin/students",
                formData
            );

            setMessage(
                data.message || "Student added successfully"
            );

            form.reset();
            setFaculty("");
            setSemester("");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setMessage(
                    error.response?.data?.message ||
                        "Failed to add student"
                );
            } else {
                setMessage("Failed to add student");
            }
        } finally {
            setLoading(false);
        }
    };

    const selectClass =
        "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30";

    return (
        <div className="flex flex-1 flex-col">
            <div className="mb-6">
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        Add Student
                    </span>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Enter all student information
                </p>
            </div>

            <form
                onSubmit={addStudent}
                className="flex flex-1 flex-col"
                noValidate
            >
                <FieldGroup className="admin-form grid gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <Field>
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter student name"
                            minLength={2}
                            required
                            aria-invalid={!!errors.name}
                        />

                        <FieldError>{errors.name}</FieldError>
                    </Field>

                    {/* Email */}
                    <Field>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="student@example.com"
                            required
                            aria-invalid={!!errors.email}
                        />

                        <FieldError>{errors.email}</FieldError>
                    </Field>

                    {/* Roll Number */}
                    <Field>
                        <Label htmlFor="rollNumber">
                            Roll Number
                        </Label>

                        <Input
                            id="rollNumber"
                            name="rollNumber"
                            type="text"
                            placeholder="Enter roll number"
                            required
                            aria-invalid={!!errors.rollNumber}
                        />

                        <FieldError>{errors.rollNumber}</FieldError>
                    </Field>

                    {/* Semester */}
                    <Field>
                        <Label htmlFor="semester">Semester</Label>

                        <select
                            id="semester"
                            name="semester"
                            value={semester}
                            onChange={(e) =>
                                setSemester(e.target.value)
                            }
                            className={selectClass}
                            required
                            aria-invalid={!!errors.semester}
                        >
                            <option value="">Select Semester</option>

                            <option value="1">Semester 1</option>

                            <option value="2">Semester 2</option>

                            <option value="3">Semester 3</option>

                            <option value="4">Semester 4</option>

                            <option value="5">Semester 5</option>

                            <option value="6">Semester 6</option>

                            <option value="7">Semester 7</option>

                            <option value="8">Semester 8</option>
                        </select>

                        <FieldError>{errors.semester}</FieldError>
                    </Field>

                    {/* GPA */}
                    <Field>
                        <Label htmlFor="gpa">GPA</Label>

                        <Input
                            id="gpa"
                            name="gpa"
                            type="number"
                            min={0}
                            max={4}
                            step={0.01}
                            placeholder="Enter GPA (0-4)"
                            required
                            aria-invalid={!!errors.gpa}
                        />

                        <FieldError>{errors.gpa}</FieldError>
                    </Field>

                    {/* Faculty */}
                    <Field>
                        <Label htmlFor="faculty">Faculty</Label>

                        <select
                            id="faculty"
                            name="faculty"
                            value={faculty}
                            onChange={(e) =>
                                setFaculty(e.target.value)
                            }
                            className={selectClass}
                            required
                            aria-invalid={!!errors.faculty}
                        >
                            <option value="">Select Faculty</option>

                            <option value="BCA">BCA</option>

                            <option value="BSc CSIT">BSc CSIT</option>

                            <option value="BIT">BIT</option>

                            <option value="BIM">BIM</option>

                            <option value="BBA">BBA</option>
                        </select>

                        <FieldError>{errors.faculty}</FieldError>
                    </Field>

                    {/* Course */}
                    <Field>
                        <Label htmlFor="courses">Course</Label>

                        <select
                            id="courses"
                            name="courses"
                            className={selectClass}
                            required
                            disabled={!faculty || !semester}
                            aria-invalid={!!errors.courses}
                        >
                            <option value="">
                                {!faculty
                                    ? "Select Faculty First"
                                    : !semester
                                    ? "Select Semester First"
                                    : "Select Course"}
                            </option>

                            {filteredCourses.map((course) => (
                                <option
                                    key={course._id}
                                    value={course._id}
                                >
                                    {course.name}
                                </option>
                            ))}
                        </select>

                        <FieldError>{errors.courses}</FieldError>
                    </Field>

                    {/* Student Picture */}
                    <Field>
                        <Label htmlFor="picture">Student Picture</Label>

                        <Input
                            id="picture"
                            name="picture"
                            type="file"
                            accept="image/*"
                        />
                    </Field>
                </FieldGroup>

                <div className="mt-auto space-y-4 pt-4">
                    {/* Message */}
                    {message && (
                        <div className="rounded-2xl border border-border bg-muted/50 p-3 text-center text-sm">
                            {message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-base font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Student"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
