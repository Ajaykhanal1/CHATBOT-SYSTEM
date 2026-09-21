import { Router } from "express";
import {
  sendMessage,
  getMessages,
} from "../controllers/messageController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/:chatId", sendMessage);
router.get("/:chatId", getMessages);

export default router;