import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import documentRoutes from "./routes/document.routes";
import studentRoutes from "./routes/studentRoutes";
import courseRoutes from "./routes/courseRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import noticeRoutes from "./routes/noticeRoutes";




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
app.use("/documents", documentRoutes);


app.use("/admin/students", studentRoutes);
app.use("/admin/courses", courseRoutes);

app.use("/admin/teachers", teacherRoutes);
app.use("/admin/attendance", attendanceRoutes);
app.use("/admin/notices", noticeRoutes);


export default app;