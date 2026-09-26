"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="mb-3 rounded-lg border bg-white p-3 shadow-sm">
      <h2 className="text-lg font-semibold">👨‍🏫 Teachers</h2>

      <div className="mt-2 flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger
            render={
              <Button className="rounded-md bg-black px-3 py-1.5 text-sm text-white">
                Add Teacher
              </Button>
            }
          />

          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Teacher</DialogTitle>

                <DialogDescription>
                  Enter all teacher information.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="mt-4">
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
                    className="h-9 w-full rounded-md border bg-white px-3 text-sm"
                  >
                    <option value="">Select Faculty</option>

                    <option value="BCA">
                      BCA
                    </option>

                    <option value="BIM">
                      BIM
                    </option>

                    <option value="BBA">
                      BBA
                    </option>

                    <option value="CSIT">
                      CSIT
                    </option>

                    <option value="BBM">
                      BBM
                    </option>
                  </select>
                </Field>

                {/* Course */}
                <Field>
                  <Label htmlFor="courses">Course</Label>

                  <select
                    id="courses"
                    value={courses[0] || ""}
                    onChange={(e) => {
                      setCourses(
                        e.target.value ? [e.target.value] : []
                      );
                    }}
                    disabled={!faculty}
                    required
                    className="h-9 w-full rounded-md border bg-white px-3 text-sm disabled:bg-gray-100"
                  >
                    <option value="">
                      {faculty
                        ? "Select Course"
                        : "Select Faculty First"}
                    </option>

                    {filteredCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </FieldGroup>

              {message && (
                <p className="mt-3 rounded-md bg-gray-50 p-2 text-center text-sm">
                  {message}
                </p>
              )}

              <DialogFooter className="mt-4">
                <DialogClose
                  render={
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  }
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Teacher"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          type="button"
          variant="outline"
          className="rounded-md px-3 py-1.5 text-sm"
        >
          Teacher List
        </Button>
      </div>
    </div>
  );
}