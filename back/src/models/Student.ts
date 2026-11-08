import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
    user?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    rollNumber: string;
    semester: number;
    faculty: string;
    gpa: number;
    courses: mongoose.Types.ObjectId[];
    picture?: string;
}

const studentSchema = new Schema<IStudent>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            sparse: true,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
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

        faculty: {
            type: String,
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

        picture: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IStudent>("Student", studentSchema);