import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth && (socket.handshake.auth as any).token) ||
        (socket.handshake.headers.authorization?.split(" ")[1]);

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
        email: string;
      };

      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as any).user?.id;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("chat:join", (data: { chatId: string }) => {
      if (data?.chatId) {
        socket.join(`chat:${data.chatId}`);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
