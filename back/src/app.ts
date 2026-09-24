import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import documentRoutes from "./routes/document.routes";
import searchQdrant from "./services/searchQdrant";



const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "MyChat API is running",
  });
});

app.post("/search", async (req, res) => {
 try {
    // Get question from frontend
    const { question } = req.body;
      if (!question) {
    return res.status(400).json({
      message: "Question is required",
    });
  }

    // Search Qdrant using the question
    const results = await searchQdrant(question);

    // Send relevant chunks to frontend
    res.status(200).json({
      question,
      results,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Search failed",
    });
  }
});

app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/documents", documentRoutes);

export default app;