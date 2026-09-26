import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  code: string;
  name: string;
  semester: number;
  faculty: string;
  teacher?: mongoose.Types.ObjectId;
}

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    semester: { type: Number, required: true },

    faculty: {
      type: String,
      required: true,
    },

    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>("Course", courseSchema);