import { Router } from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { chunkText } from "../services/chunkText";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF is required" });
    }

    const pdfBuffer = fs.readFileSync(req.file.path); // Read the uploaded PDF file into a buffer

    const data = await pdfParse(pdfBuffer); // Use pdf-parse to extract text from the PDF buffer

    const text = data.text; // Extracted text from the PDF
    console.log(" Text Length :"+text.length);

    // Chuck 
    const chunks = chunkText(text);
    console.log("Chunks Length :"+chunks.length);
    console.log("First Chunk :"+chunks[0]);

    res.status(201).json({
      message: "PDF text extracted and chunked successfully",
      text,
      length: text.length,
      chunks
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to extract PDF text",
    });
  }
});


export default router;