import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";

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

app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);

export default app;