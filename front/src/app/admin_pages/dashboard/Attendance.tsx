"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
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
        response.data.message || "Attendance added successfully"
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
          error.response?.data?.message || "Failed to add attendance"
        );
      } else {
        setMessage("Failed to add attendance");
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
            Add Attendance
          </span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select faculty, semester and student
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          {/* Faculty */}
          <Field>
            <Label htmlFor="faculty">Faculty</Label>

            <select
              id="faculty"
              value={faculty}
              onChange={handleFacultyChange}
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

          {/* Semester */}
          <Field>
            <Label htmlFor="semester">Semester</Label>

            <select
              id="semester"
              value={semester}
              onChange={handleSemesterChange}
              disabled={!faculty}
              required
              className={selectClass}
            >
              <option value="">
                {faculty ? "Select Semester" : "Select Faculty First"}
              </option>

              {Array.from({ length: 8 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Semester {index + 1}
                </option>
              ))}
            </select>
          </Field>

          {/* Student */}
          <Field>
            <Label htmlFor="student">Student</Label>

            <select
              id="student"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              disabled={!semester}
              required
              className={selectClass}
            >
              <option value="">
                {semester ? "Select Student" : "Select Semester First"}
              </option>

              {filteredStudents.map((item) => (
                <option key={item._id} value={item._id}>
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
              onChange={(e) => setPercentage(e.target.value)}
              required
            />
          </Field>
        </FieldGroup>

        <div className="mt-auto space-y-4 pt-4">
          {/* Message */}
          {message && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm">
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Attendance"}
          </Button>
        </div>
      </form>
    </div>
  );
}
