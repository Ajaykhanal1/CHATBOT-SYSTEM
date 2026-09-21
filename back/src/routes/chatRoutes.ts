import { Router } from "express";
import {
  createChat,
  getChats,
  deleteChat,
  renameChat,
} from "../controllers/chatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createChat);
router.get("/", getChats);
router.put("/:chatId", renameChat);

router.delete("/:chatId", deleteChat);

export default router;