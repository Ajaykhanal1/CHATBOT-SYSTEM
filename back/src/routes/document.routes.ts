import { Router } from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { chunkText } from "../services/chunkText";
import { generateEmbedding } from "../services/embedding";
import getQdrantClient from "../config/qdrant";
import { randomUUID } from "crypto";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware";

const router = Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  (req, res, next) => {
    upload.single("pdf")(req, res, (error) => {
      if (!error) return next();

      // Multer errors are not caught by the handler, so map them to JSON here.
      const status =
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE"
          ? 413
          : 400;

      res.status(status).json({ message: error.message });
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "PDF is required" });
      }

      const qdrant = await getQdrantClient(); // Get Qdrant client instance

      const pdfBuffer = fs.readFileSync(req.file.path); // Read the uploaded PDF file into a buffer

      const data = await pdfParse(pdfBuffer); // Use pdf-parse to extract text from the PDF buffer

      const text = data.text; // Extracted text from the PDF

      // Chunk the text
      const chunks = chunkText(text);

      for (const [index, chunk] of chunks.entries()) {
        const embedding = await generateEmbedding(chunk);

        await qdrant.upsert("chatbot_documents", {
          wait: true,
          points: [
            {
              id: randomUUID(),
              vector: embedding,
              payload: {
                documentId: req.file.filename,
                fileName: req.file.originalname,
                chunkIndex: index,
                text: chunk,
              },
            },
          ],
        });
      }

      res.status(201).json({
        message: "PDF Uploaded and processed successfully",
        text,
        length: text.length,
        chunks,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to process PDF",
      });
    } finally {
      if (req.file) fs.unlink(req.file.path, () => {});
    }
  }
);

export default router;
