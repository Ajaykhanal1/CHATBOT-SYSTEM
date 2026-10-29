"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios/axios";

interface Course {
  _id: string;
  name: string;
  faculty: string;
}

export default function Teacher() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [courses, setCourses] = useState<string[]>([]);

  const [courseList, setCourseList] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await api.get("/admin/courses");
        setCourseList(response.data);
      } catch (error) {
        console.error("Get courses error:", error);
      }
    };

    getCourses();
  }, []);

  const filteredCourses = courseList.filter(
    (course) => course.faculty === faculty
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await api.post("/admin/teachers", {
        name,
        email,
        faculty,
        courses,
      });

      setMessage(response.data.message || "Teacher added successfully");

      setName("");
      setEmail("");
      setFaculty("");
      setCourses([]);
    } catch (error: unknown) {
      console.error("Create teacher error:", error);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Failed to add teacher"
        );
      } else {
        setMessage("Failed to add teacher");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectClass =
    "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30";

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Add Teacher
          </span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter all teacher information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <FieldGroup className="admin-form grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <Field>
            <Label htmlFor="teacher-name">Name</Label>

            <Input
              id="teacher-name"
              type="text"
              placeholder="Enter teacher name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              required
            />
          </Field>

          {/* Email */}
          <Field>
            <Label htmlFor="teacher-email">Email</Label>

            <Input
              id="teacher-email"
              type="email"
              placeholder="teacher@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          {/* Faculty */}
          <Field>
            <Label htmlFor="faculty">Faculty</Label>

            <select
              id="faculty"
              value={faculty}
              onChange={(e) => {
                setFaculty(e.target.value);
                setCourses([]);
              }}
              required
              className={selectClass}
            >
              <option value="">Select Faculty</option>

              <option value="BCA">BCA</option>

              <option value="BIM">BIM</option>

              <option value="BBA">BBA</option>

              <option value="CSIT">CSIT</option>

              <option value="BBM">BBM</option>
            </select>
          </Field>

          {/* Course */}
          <Field>
            <Label htmlFor="courses">Course</Label>

            <select
              id="courses"
              value={courses[0] || ""}
              onChange={(e) => {
                setCourses(e.target.value ? [e.target.value] : []);
              }}
              disabled={!faculty}
              required
              className={selectClass}
            >
              <option value="">
                {faculty ? "Select Course" : "Select Faculty First"}
              </option>

              {filteredCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
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
            disabled={isLoading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-base font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Teacher"}
          </Button>
        </div>
      </form>
    </div>
  );
}
