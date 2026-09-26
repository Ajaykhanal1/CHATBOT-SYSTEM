import { Router } from "express";

import {
  createAttendance,
  getAttendances,
} from "../controllers/attendanceController";

const router = Router();

router.post("/", createAttendance);
router.get("/", getAttendances);

export default router;