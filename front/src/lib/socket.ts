"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const token = localStorage.getItem("token");
    socket = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000", {
      auth: { token },
      withCredentials: true,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
