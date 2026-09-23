import { Router } from "express";
import multer from "multer";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "PDF is required" });
  }

  res.status(201).json({
    message: "PDF uploaded successfully",
    file: req.file,
  });
});

export default router;