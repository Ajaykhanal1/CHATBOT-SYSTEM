import { Router } from "express";

import {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController";

const router = Router();

router.post("/", createNotice);
router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;