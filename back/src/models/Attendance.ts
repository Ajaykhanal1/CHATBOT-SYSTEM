import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  semester: number;
  attendance_percentage: number;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    attendance_percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAttendance>(
  "Attendance",
  attendanceSchema
);