import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL!],
  },
});

export const getRecieverSocketId = (userId: string) => {
  return userSocketMap[userId];
};

// used to store online users
const userSocketMap: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log("a user connected ", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to end events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
