import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs";
import { setNotificationEmitter } from "./notification-emitter";
import { setMessageEmitter } from "./message-emitter";

let io: Server | null = null;

const getTokenFromSocket = (socket: any): string | null => {
  const authToken = socket.handshake?.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken.trim();
  }

  const headerToken = socket.handshake?.headers?.authorization;
  if (typeof headerToken === "string" && headerToken.startsWith("Bearer ")) {
    return headerToken.split(" ")[1];
  }

  return null;
};

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    try {
      const token = getTokenFromSocket(socket);
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (!decoded?.id) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = decoded.id.toString();
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("conversation:join", (conversationId: string) => {
      if (typeof conversationId === "string" && conversationId.trim()) {
        socket.join(`conversation:${conversationId.trim()}`);
      }
    });

    socket.on("conversation:leave", (conversationId: string) => {
      if (typeof conversationId === "string" && conversationId.trim()) {
        socket.leave(`conversation:${conversationId.trim()}`);
      }
    });
  });

  setNotificationEmitter((userId, notification) => {
    if (!io) return;
    io.to(`user:${userId}`).emit("notification:new", notification);
  });

  setMessageEmitter(({ senderId, receiverId, conversationId, message }) => {
    if (!io) return;
    io.to(`user:${senderId}`).emit("message:new", message);
    io.to(`user:${receiverId}`).emit("message:new", message);
    io.to(`conversation:${conversationId}`).emit("message:new", message);
  });

  return io;
};

export const getIO = () => io;
