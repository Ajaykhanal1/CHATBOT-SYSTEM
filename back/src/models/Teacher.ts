import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  email: string;
  courses: mongoose.Types.ObjectId[];
}

const teacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>("Teacher", teacherSchema);