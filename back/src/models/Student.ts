import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    email: string;
    rollNumber: string;
    semester: number;
    gpa: number;
    courses: mongoose.Types.ObjectId[];
}

const studentSchema = new Schema<IStudent>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        rollNumber: {
            type: String,
            required: true,
            unique: true,
        },

        semester: {
            type: Number,
            required: true,
        },

        gpa: {
            type: Number,
            default: 0,
        },

        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IStudent>("Student", studentSchema);