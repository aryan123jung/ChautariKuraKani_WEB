import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs";
import { setNotificationEmitter } from "./notification-emitter";
import { setMessageEmitter } from "./message-emitter";
import { CallService } from "../services/call.services";
import { CallType } from "../models/call-log.model";

let io: Server | null = null;
const callService = new CallService();
const callTimeouts = new Map<string, NodeJS.Timeout>();
const userActiveCallMap = new Map<string, string>();

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

    socket.on(
      "call:initiate",
      async (
        payload: { calleeId: string; callType?: CallType },
        ack?: (response: any) => void
      ) => {
        try {
          const callerId = socket.data.userId as string;
          const calleeId = payload?.calleeId;
          const callType = payload?.callType || "audio";

          if (!calleeId) {
            throw new Error("calleeId is required");
          }

          if (userActiveCallMap.has(callerId) || userActiveCallMap.has(calleeId)) {
            throw new Error("Caller or callee is already in another call");
          }

          const callLog = await callService.initiateCall(callerId, calleeId, callType);
          const callId = callLog._id.toString();

          userActiveCallMap.set(callerId, callId);
          userActiveCallMap.set(calleeId, callId);

          io?.to(`user:${calleeId}`).emit("call:incoming", {
            callId,
            callerId,
            calleeId,
            callType
          });

          io?.to(`user:${callerId}`).emit("call:ringing", {
            callId,
            callerId,
            calleeId,
            callType
          });

          const timeout = setTimeout(async () => {
            try {
              const current = await callService.getCallById(callId);
              if (current.status === "RINGING") {
                await callService.missCall(callId);
                io?.to(`user:${callerId}`).emit("call:missed", { callId, userId: calleeId });
                io?.to(`user:${calleeId}`).emit("call:missed", { callId, userId: callerId });
              }
            } catch (error) {
              // ignore timeout update errors
            } finally {
              callTimeouts.delete(callId);
              userActiveCallMap.delete(callerId);
              userActiveCallMap.delete(calleeId);
            }
          }, 30000);

          callTimeouts.set(callId, timeout);
          ack?.({ success: true, data: { callId } });
        } catch (error: any) {
          ack?.({ success: false, message: error.message || "Failed to initiate call" });
        }
      }
    );

    socket.on(
      "call:accept",
      async (payload: { callId: string }, ack?: (response: any) => void) => {
        try {
          const userId = socket.data.userId as string;
          const callId = payload?.callId;
          if (!callId) {
            throw new Error("callId is required");
          }

          const call = await callService.getCallById(callId);
          const calleeId = (call.calleeId as any)?._id?.toString?.() || call.calleeId.toString();
          const callerId = (call.callerId as any)?._id?.toString?.() || call.callerId.toString();

          if (calleeId !== userId) {
            throw new Error("Only callee can accept call");
          }
          if (call.status !== "RINGING") {
            throw new Error(`Cannot accept call in ${call.status} state`);
          }

          await callService.acceptCall(callId);

          const timeout = callTimeouts.get(callId);
          if (timeout) {
            clearTimeout(timeout);
            callTimeouts.delete(callId);
          }

          socket.join(`call:${callId}`);
          io?.to(`user:${callerId}`).emit("call:accepted", { callId, by: calleeId });
          io?.to(`user:${calleeId}`).emit("call:accepted", { callId, by: calleeId });
          ack?.({ success: true });
        } catch (error: any) {
          ack?.({ success: false, message: error.message || "Failed to accept call" });
        }
      }
    );

    socket.on(
      "call:reject",
      async (payload: { callId: string }, ack?: (response: any) => void) => {
        try {
          const userId = socket.data.userId as string;
          const callId = payload?.callId;
          if (!callId) throw new Error("callId is required");

          const call = await callService.getCallById(callId);
          const calleeId = (call.calleeId as any)?._id?.toString?.() || call.calleeId.toString();
          const callerId = (call.callerId as any)?._id?.toString?.() || call.callerId.toString();

          if (calleeId !== userId) {
            throw new Error("Only callee can reject call");
          }
          if (call.status !== "RINGING") {
            throw new Error(`Cannot reject call in ${call.status} state`);
          }

          await callService.rejectCall(callId);

          const timeout = callTimeouts.get(callId);
          if (timeout) {
            clearTimeout(timeout);
            callTimeouts.delete(callId);
          }

          userActiveCallMap.delete(callerId);
          userActiveCallMap.delete(calleeId);

          io?.to(`user:${callerId}`).emit("call:rejected", { callId, by: calleeId });
          io?.to(`user:${calleeId}`).emit("call:rejected", { callId, by: calleeId });
          ack?.({ success: true });
        } catch (error: any) {
          ack?.({ success: false, message: error.message || "Failed to reject call" });
        }
      }
    );

    socket.on(
      "call:offer",
      async (
        payload: { callId: string; offer: any },
        ack?: (response: any) => void
      ) => {
        try {
          const userId = socket.data.userId as string;
          const callId = payload?.callId;
          if (!callId || !payload?.offer) throw new Error("callId and offer are required");

          const call = await callService.getCallById(callId);
          const callerId = (call.callerId as any)?._id?.toString?.() || call.callerId.toString();
          const calleeId = (call.calleeId as any)?._id?.toString?.() || call.calleeId.toString();
          if (userId !== callerId && userId !== calleeId) throw new Error("Not a call participant");

          const targetUserId = userId === callerId ? calleeId : callerId;
          io?.to(`user:${targetUserId}`).emit("call:offer", {
            callId,
            fromUserId: userId,
            offer: payload.offer
          });
          ack?.({ success: true });
        } catch (error: any) {
          ack?.({ success: false, message: error.message || "Failed to relay offer" });
        }
      }
    );

    socket.on(
      "call:answer",
      async (
        payload: { callId: string; answer: any },
        ack?: (response: any) => void
      ) => {
        try {
          const userId = socket.data.userId as string;
          const callId = payload?.callId;
          if (!callId || !payload?.answer) throw new Error("callId and answer are required");

          const call = await callService.getCallById(callId);
          const callerId = (call.callerId as any)?._id?.toString?.() || call.callerId.toString();
          const calleeId = (call.calleeId as any)?._id?.toString?.() || call.calleeId.toString();
          if (userId !== callerId && userId !== calleeId) throw new Error("Not a call participant");

          const targetUserId = userId === callerId ? calleeId : callerId;
          io?.to(`user:${targetUserId}`).emit("call:answer", {
            callId,
            fromUserId: userId,
            answer: payload.answer
          });
          ack?.({ success: true });
        } catch (error: any) {
          ack?.({ success: false, message: error.message || "Failed to relay answer" });
        }
      }
    );

    socket.on(
      "call:ice-candidate",
      async (
        payload: { callId: string; candidate: any },
        ack?: (response: any) => void
      ) => {
        try {
          const userId = socket.data.userId as string;
          const callId = payload?.callId;
          if (!callId || !payload?.candidate) {
            throw new Error("callId and candidate are required");
          }

          const call = await callService.getCallById(callId);
          const callerId = (call.callerId as any)?._id?.toString?.() || call.callerId.toString();
          const calleeId = (call.calleeId as any)?._id?.toString?.() || call.calleeId.toString();
          if (userId !== callerId && userId !== calleeId) throw new Error("Not a call participant");

          const targetUserId = userId === callerId ? calleeId : callerId;
          io?.to(`user:${targetUserId}`).emit("call:ice-candidate", {
            callId,
            fromUserId: userId,
            candidate: payload.candidate
          });
          ack?.({ success: true });
        } catch (error: any) {
          ack?.({ success: false, message: error.message || "Failed to relay candidate" });
        }
      }
    );

    socket.on(
      "call:end",
      async (payload: { callId: string }, ack?: (response: any) => void) => {
        try {
          const userId = socket.data.userId as string;
          const callId = payload?.callId;
          if (!callId) throw new Error("callId is required");

          const call = await callService.getCallById(callId);
          const callerId = (call.callerId as any)?._id?.toString?.() || call.callerId.toString();
          const calleeId = (call.calleeId as any)?._id?.toString?.() || call.calleeId.toString();
          if (userId !== callerId && userId !== calleeId) throw new Error("Not a call participant");

          if (call.status === "RINGING" || call.status === "ACCEPTED") {
            await callService.endCall(callId);
          }

          const timeout = callTimeouts.get(callId);
          if (timeout) {
            clearTimeout(timeout);
            callTimeouts.delete(callId);
          }

          userActiveCallMap.delete(callerId);
          userActiveCallMap.delete(calleeId);

          io?.to(`user:${callerId}`).emit("call:ended", { callId, by: userId });
          io?.to(`user:${calleeId}`).emit("call:ended", { callId, by: userId });
          ack?.({ success: true });
        } catch (error: any) {
          ack?.({ success: false, message: error.message || "Failed to end call" });
        }
      }
    );
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
