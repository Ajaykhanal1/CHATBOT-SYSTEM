import { Schema, model, Document } from "mongoose";

interface INotice extends Document {
  title: string;
  content: string;
  publishedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<INotice>("Notice", noticeSchema);