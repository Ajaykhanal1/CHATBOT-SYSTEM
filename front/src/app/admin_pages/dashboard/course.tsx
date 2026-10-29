"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { api } from "@/lib/axios/axios";
import { Button } from "@/components/ui/button";
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

      const { data } = await api.post("/admin/courses", courseData);

      setMessage(data.message || "Course added successfully");

      form.reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Failed to add course"
        );
      } else {
        setMessage("Failed to add course");
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
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Add Course
          </span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter all course information
        </p>
      </div>

      <form onSubmit={addCourse} className="flex flex-1 flex-col">
        <FieldGroup className="admin-form grid gap-4 sm:grid-cols-2">
          {/* Course Name */}
          <Field className="sm:col-span-2">
            <Label htmlFor="name">Course Name</Label>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Database Management System"
              minLength={2}
              required
            />
          </Field>

          {/* Course Code */}
          <Field>
            <Label htmlFor="code">Course Code</Label>

            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g. CS101"
              required
            />
          </Field>

          {/* Semester */}
          <Field>
            <Label htmlFor="semester">Semester</Label>

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

          {/* Faculty */}
          <Field>
            <Label htmlFor="faculty">Faculty</Label>

            <select
              id="faculty"
              name="faculty"
              className={selectClass}
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
            <Label htmlFor="teacher">Teacher</Label>

            <select
              id="teacher"
              name="teacher"
              className={selectClass}
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </Field>
        </FieldGroup>

        <div className="mt-auto space-y-4 pt-4">
          {message && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm">
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-base font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Course"}
          </Button>
        </div>
      </form>
    </div>
  );
}
