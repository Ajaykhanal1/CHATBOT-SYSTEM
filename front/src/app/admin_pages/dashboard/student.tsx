"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { api } from "@/lib/axios/axios";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Course {
    _id: string;
    name: string;
    faculty: string;
    semester: number;
}

export default function Student() {
    const [message, setMessage] = useState("");
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

        const studentData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            rollNumber: formData.get("rollNumber") as string,
            semester: Number(formData.get("semester")),
            gpa: Number(formData.get("gpa")),
            courses: [formData.get("courses") as string],
        };

        try {
            setLoading(true);
            setMessage("");

            const { data } = await api.post(
                "/admin/students",
                studentData
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

    return (
        <div className="mb-3 rounded-lg border bg-white p-3 shadow-sm">
            <h2 className="text-lg font-semibold">
                👨‍🎓 Students
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
                <Dialog>
                    <DialogTrigger
                        render={
                            <Button className="rounded-md bg-black px-3 py-1.5 text-sm text-white">
                                Add Student
                            </Button>
                        }
                    />

                    <DialogContent className="sm:max-w-sm">
                        <form onSubmit={addStudent}>
                            <DialogHeader>
                                <DialogTitle>
                                    Add Student
                                </DialogTitle>

                                <DialogDescription>
                                    Enter all student information.
                                </DialogDescription>
                            </DialogHeader>

                            <FieldGroup>
                                {/* Name */}
                                <Field>
                                    <Label htmlFor="name">
                                        Name
                                    </Label>

                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter student name"
                                        minLength={2}
                                        required
                                    />
                                </Field>

                                {/* Email */}
                                <Field>
                                    <Label htmlFor="email">
                                        Email
                                    </Label>

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="student@example.com"
                                        required
                                    />
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
                                    />
                                </Field>

                                {/* Semester */}
                                <Field>
                                    <Label htmlFor="semester">
                                        Semester
                                    </Label>

                                    <select
                                        id="semester"
                                        name="semester"
                                        value={semester}
                                        onChange={(e) =>
                                            setSemester(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="">
                                            Select Semester
                                        </option>

                                        <option value="1">
                                            Semester 1
                                        </option>

                                        <option value="2">
                                            Semester 2
                                        </option>

                                        <option value="3">
                                            Semester 3
                                        </option>

                                        <option value="4">
                                            Semester 4
                                        </option>

                                        <option value="5">
                                            Semester 5
                                        </option>

                                        <option value="6">
                                            Semester 6
                                        </option>

                                        <option value="7">
                                            Semester 7
                                        </option>

                                        <option value="8">
                                            Semester 8
                                        </option>
                                    </select>
                                </Field>

                                {/* GPA */}
                                <Field>
                                    <Label htmlFor="gpa">
                                        GPA
                                    </Label>

                                    <Input
                                        id="gpa"
                                        name="gpa"
                                        type="number"
                                        min={0}
                                        max={4}
                                        step={0.01}
                                        placeholder="Enter GPA (0-4)"
                                        required
                                    />
                                </Field>

                                {/* Faculty */}
                                <Field>
                                    <Label htmlFor="faculty">
                                        Faculty
                                    </Label>

                                    <select
                                        id="faculty"
                                        name="faculty"
                                        value={faculty}
                                        onChange={(e) =>
                                            setFaculty(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="">
                                            Select Faculty
                                        </option>

                                        <option value="BCA">
                                            BCA
                                        </option>

                                        <option value="BSc CSIT">
                                            BSc CSIT
                                        </option>

                                        <option value="BIT">
                                            BIT
                                        </option>

                                        <option value="BIM">
                                            BIM
                                        </option>

                                        <option value="BBA">
                                            BBA
                                        </option>
                                    </select>
                                </Field>

                                {/* Course */}
                                <Field>
                                    <Label htmlFor="courses">
                                        Course
                                    </Label>

                                    <select
                                        id="courses"
                                        name="courses"
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                        required
                                        disabled={
                                            !faculty ||
                                            !semester
                                        }
                                    >
                                        <option value="">
                                            {!faculty
                                                ? "Select Faculty First"
                                                : !semester
                                                ? "Select Semester First"
                                                : "Select Course"}
                                        </option>

                                        {filteredCourses.map(
                                            (course) => (
                                                <option
                                                    key={course._id}
                                                    value={course._id}
                                                >
                                                    {course.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>
                            </FieldGroup>

                            {/* Message */}
                            {message && (
                                <p className="mt-3 rounded-md bg-gray-100 p-2 text-center text-sm">
                                    {message}
                                </p>
                            )}

                            <DialogFooter className="mt-4">
                                <DialogClose
                                    render={
                                        <Button
                                            type="button"
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    }
                                />

                                <Button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Adding..."
                                        : "Add Student"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <button className="rounded-md border px-3 py-1.5 text-sm">
                    Student List
                </button>
            </div>
        </div>
    );
}
