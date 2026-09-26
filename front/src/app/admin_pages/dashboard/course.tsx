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

interface Teacher {
    _id: string;
    name: string;
}

export default function Course() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const { data } = await api.get("/admin/teachers");
                setTeachers(data);
            } catch (error) {
                console.error("Failed to fetch teachers:", error);
            }
        };

        fetchTeachers();
    }, []);

    const addCourse = async (
    e: React.FormEvent<HTMLFormElement>
) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const teacher = formData.get("teacher") as string;

    const courseData = {
        code: formData.get("code") as string,
        name: formData.get("name") as string,
        semester: Number(formData.get("semester")),
        ...(teacher && { teacher }),
        faculty: formData.get("faculty") as string,
    };

    try {
        setLoading(true);
        setMessage("");

        const { data } = await api.post(
            "/admin/courses",
            courseData
        );

        setMessage(
            data.message || "Course added successfully"
        );

        form.reset();
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            setMessage(
                error.response?.data?.message ||
                "Failed to add course"
            );
        } else {
            setMessage("Failed to add course");
        }
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="mb-3 rounded-lg border bg-white p-3 shadow-sm">
            <h2 className="text-lg font-semibold">
                📚 Courses
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
                <Dialog>
                    <DialogTrigger
                        render={
                            <Button className="rounded-md bg-black px-3 py-1.5 text-sm text-white">
                                Add Course
                            </Button>
                        }
                    />

                    <DialogContent className="sm:max-w-sm">
                        <form onSubmit={addCourse}>
                            <DialogHeader>
                                <DialogTitle>
                                    Add Course
                                </DialogTitle>

                                <DialogDescription>
                                    Enter all course information.
                                </DialogDescription>
                            </DialogHeader>

                            <FieldGroup>
                                {/* Course Code */}
                                <Field>
                                    <Label htmlFor="code">
                                        Course Code
                                    </Label>

                                    <Input
                                        id="code"
                                        name="code"
                                        type="text"
                                        placeholder="e.g. CS101"
                                        required
                                    />
                                </Field>

                                {/* Course Name */}
                                <Field>
                                    <Label htmlFor="name">
                                        Course Name
                                    </Label>

                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Database Management System"
                                        minLength={2}
                                        required
                                    />
                                </Field>

                                {/* Semester */}
                                <Field>
                                    <Label htmlFor="semester">
                                        Semester
                                    </Label>

                                    <Input
                                        id="semester"
                                        name="semester"
                                        type="number"
                                        min={1}
                                        max={8}
                                        placeholder="Enter semester (1-8)"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="faculty">Faculty</Label>

                                    <select
                                        id="faculty"
                                        name="faculty"
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="">Select Faculty</option>
                                        <option value="BCA">BCA</option>
                                        <option value="BSc CSIT">BSc CSIT</option>
                                        <option value="BIT">BIT</option>
                                        <option value="BIM">BIM</option>
                                        <option value="BBA">BBA</option>
                                    </select>
                                </Field>

                                {/* Teacher */}
                                <Field>
                                    <Label htmlFor="teacher">
                                        Teacher
                                    </Label>

                                    <select
                                        id="teacher"
                                        name="teacher"
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                    >
                                        <option value="">
                                            Select Teacher
                                        </option>

                                        {teachers.map((teacher) => (
                                            <option
                                                key={teacher._id}
                                                value={teacher._id}
                                            >
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </FieldGroup>

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
                                        : "Add Course"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <button className="rounded-md border px-3 py-1.5 text-sm">
                    Course List
                </button>
            </div>
        </div>
    );
}