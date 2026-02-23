import { Request, Response } from "express";
import { QueryParams } from "../types/query.type";
import { MessageService } from "../services/message.services";

const messageService = new MessageService();

export class MessageController {
  async getOrCreateConversation(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const otherUserId = req.params.otherUserId;
      const conversation = await messageService.getOrCreateConversation(
        currentUserId,
        otherUserId
      );

      return res.status(200).json({
        success: true,
        data: conversation,
        message: "Conversation ready"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async listConversations(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { page, size }: QueryParams = req.query;
      const { conversations, pagination } = await messageService.listConversations(
        currentUserId,
        page,
        size
      );

      return res.status(200).json({
        success: true,
        data: conversations,
        pagination,
        message: "Conversations fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async listMessages(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const conversationId = req.params.conversationId;
      const { page, size }: QueryParams = req.query;
      const { messages, pagination } = await messageService.listMessages(
        currentUserId,
        conversationId,
        page,
        size
      );

      return res.status(200).json({
        success: true,
        data: messages,
        pagination,
        message: "Messages fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const conversationId = req.params.conversationId;
      const { text } = req.body;
      const message = await messageService.sendMessage(currentUserId, conversationId, text);

      return res.status(201).json({
        success: true,
        data: message,
        message: "Message sent successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async markRead(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const conversationId = req.params.conversationId;
      await messageService.markConversationRead(currentUserId, conversationId);

      return res.status(200).json({
        success: true,
        message: "Conversation marked as read"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
