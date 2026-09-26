import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { User } from "../models/user.model";

export const getUsers = async (
    req: Request,
    res: Response
) => {
    try {
        const users = await User.find()
            .select("name email role");

        return res.json(users);
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};