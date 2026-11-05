import { Router } from "express";
import {
  sendMessage,
  getMessages,
  regenerateResponse,
  editMessage,
  setMessageFeedback,
} from "../controllers/messageController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/:chatId", sendMessage);
router.get("/:chatId", getMessages);
router.post("/:chatId/regenerate", regenerateResponse);
router.put("/:chatId/:messageId", editMessage);
router.patch("/:chatId/:messageId/feedback", setMessageFeedback);

export default router;
