import { Router } from "express";
import { testQuestion } from "../controllers/collegeQueryController";

const router = Router();

router.post("/test-student", testQuestion);

export default router;