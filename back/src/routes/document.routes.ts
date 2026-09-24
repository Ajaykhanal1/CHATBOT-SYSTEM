import { Router } from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { chunkText } from "../services/chunkText";
import { generateEmbedding } from "../services/embedding";
import getQdrantClient from "../config/qdrant";
import { randomUUID } from "crypto";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("pdf"), async (req, res) => {
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
      message: "Failed to extract PDF text",
    });
  }
});

export default router;
