import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import http from "http";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();