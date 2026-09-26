import { Router } from "express";

import {
  createTeacher,
  getTeachers,
} from "../controllers/teacherController";

const router = Router();

router.post("/", createTeacher);
router.get("/", getTeachers);

export default router;