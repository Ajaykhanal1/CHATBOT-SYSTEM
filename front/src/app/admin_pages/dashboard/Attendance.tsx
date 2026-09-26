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

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  semester: number;
}

export default function Attendance() {
  const [faculty, setFaculty] = useState("");
  const [semester, setSemester] = useState("");
  const [student, setStudent] = useState("");
  const [percentage, setPercentage] = useState("");

  const [students, setStudents] = useState<Student[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get students
  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await api.get("/admin/students");

        setStudents(response.data);
      } catch (error) {
        console.error("Get students error:", error);
      }
    };

    getStudents();
  }, []);

  // Students of selected semester
  const filteredStudents = students
    .filter((item) => item.semester === Number(semester))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Faculty change
  const handleFacultyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFaculty(e.target.value);
    setSemester("");
    setStudent("");
  };

  // Semester change
  const handleSemesterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSemester(e.target.value);
    setStudent("");
  };

  // Submit attendance
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await api.post("/admin/attendance", {
        student,
        semester: Number(semester),
        attendance_percentage: Number(percentage),
      });

      setMessage(
        response.data.message ||
          "Attendance added successfully"
      );

      // Reset form
      setFaculty("");
      setSemester("");
      setStudent("");
      setPercentage("");
    } catch (error: unknown) {
      console.error("Create attendance error:", error);

      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
            "Failed to add attendance"
        );
      } else {
        setMessage("Failed to add attendance");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-3 rounded-lg border bg-white p-3 shadow-sm">
      <h2 className="text-lg font-semibold">
        📊 Attendance
      </h2>

      <div className="mt-2 flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger
            render={
              <Button className="rounded-md bg-black px-3 py-1.5 text-sm text-white">
                Add Attendance
              </Button>
            }
          />

          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  Add Attendance
                </DialogTitle>

                <DialogDescription>
                  Select faculty, semester and student.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="mt-4">
                {/* Faculty */}
                <Field>
                  <Label htmlFor="faculty">
                    Faculty
                  </Label>

                  <select
                    id="faculty"
                    value={faculty}
                    onChange={handleFacultyChange}
                    required
                    className="h-9 w-full rounded-md border bg-white px-3 text-sm"
                  >
                    <option value="">
                      Select Faculty
                    </option>

                    <option value="BCA">BCA</option>
                    <option value="BIM">BIM</option>
                    <option value="BBA">BBA</option>
                    <option value="CSIT">CSIT</option>
                    <option value="BBM">BBM</option>
                  </select>
                </Field>

                {/* Semester */}
                <Field>
                  <Label htmlFor="semester">
                    Semester
                  </Label>

                  <select
                    id="semester"
                    value={semester}
                    onChange={handleSemesterChange}
                    disabled={!faculty}
                    required
                    className="h-9 w-full rounded-md border bg-white px-3 text-sm disabled:bg-gray-100"
                  >
                    <option value="">
                      {faculty
                        ? "Select Semester"
                        : "Select Faculty First"}
                    </option>

                    {Array.from(
                      { length: 8 },
                      (_, index) => (
                        <option
                          key={index + 1}
                          value={index + 1}
                        >
                          Semester {index + 1}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                {/* Student */}
                <Field>
                  <Label htmlFor="student">
                    Student
                  </Label>

                  <select
                    id="student"
                    value={student}
                    onChange={(e) =>
                      setStudent(e.target.value)
                    }
                    disabled={!semester}
                    required
                    className="h-9 w-full rounded-md border bg-white px-3 text-sm disabled:bg-gray-100"
                  >
                    <option value="">
                      {semester
                        ? "Select Student"
                        : "Select Semester First"}
                    </option>

                    {filteredStudents.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name} - {item.rollNumber}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Attendance Percentage */}
                <Field>
                  <Label htmlFor="percentage">
                    Attendance Percentage
                  </Label>

                  <Input
                    id="percentage"
                    type="number"
                    placeholder="Enter percentage"
                    min={0}
                    max={100}
                    step={0.01}
                    value={percentage}
                    onChange={(e) =>
                      setPercentage(e.target.value)
                    }
                    required
                  />
                </Field>
              </FieldGroup>

              {/* Message */}
              {message && (
                <p className="mt-3 rounded-md bg-gray-50 p-2 text-center text-sm">
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
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Adding..."
                    : "Add Attendance"}
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
          Attendance List
        </Button>
      </div>
    </div>
  );
}