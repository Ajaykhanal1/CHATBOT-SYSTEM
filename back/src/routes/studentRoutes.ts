import { Router } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

import {
    createStudent,
    getStudents,
} from "../controllers/studentController";

const router = Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cb) =>
            cb(null, `${randomUUID()}${path.extname(file.originalname)}`),
    }),
    fileFilter: (_req, file, cb) =>
        cb(null, file.mimetype.startsWith("image/")),
});

router.post("/", upload.single("picture"), createStudent);

router.get("/", getStudents);

export default router;
