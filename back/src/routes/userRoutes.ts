import { Router } from "express";

import {
  getUsers,

} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getUsers);


export default router;