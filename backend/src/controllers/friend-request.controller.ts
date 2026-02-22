import { Request, Response } from "express";
import { FriendRequestService } from "../services/friend-request.services";
import { QueryParams } from "../types/query.type";

const friendRequestService = new FriendRequestService();

export class FriendRequestController {
  async sendRequest(req: Request, res: Response) {
    try {
      const fromUserId = req.user?._id?.toString();
      if (!fromUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const toUserId = req.params.toUserId;
      const { request, autoAccepted } = await friendRequestService.sendRequest(
        fromUserId,
        toUserId
      );

      return res.status(201).json({
        success: true,
        data: request,
        message: autoAccepted
          ? "Friend request auto-accepted"
          : "Friend request sent successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async cancelRequest(req: Request, res: Response) {
    try {
      const fromUserId = req.user?._id?.toString();
      if (!fromUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const toUserId = req.params.toUserId;
      await friendRequestService.cancelRequest(fromUserId, toUserId);

      return res.status(200).json({
        success: true,
        message: "Friend request cancelled successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async acceptRequest(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const requestId = req.params.requestId;
      const request = await friendRequestService.acceptRequest(requestId, currentUserId);

      return res.status(200).json({
        success: true,
        data: request,
        message: "Friend request accepted"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async rejectRequest(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const requestId = req.params.requestId;
      const request = await friendRequestService.rejectRequest(requestId, currentUserId);

      return res.status(200).json({
        success: true,
        data: request,
        message: "Friend request rejected"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getIncomingRequests(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { page, size }: QueryParams = req.query;
      const { requests, pagination } = await friendRequestService.getIncomingRequests(
        currentUserId,
        page,
        size
      );

      return res.status(200).json({
        success: true,
        data: requests,
        pagination,
        message: "Incoming requests fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getOutgoingRequests(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { page, size }: QueryParams = req.query;
      const { requests, pagination } = await friendRequestService.getOutgoingRequests(
        currentUserId,
        page,
        size
      );

      return res.status(200).json({
        success: true,
        data: requests,
        pagination,
        message: "Outgoing requests fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async unfriend(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const friendUserId = req.params.friendUserId;
      await friendRequestService.unfriend(currentUserId, friendUserId);

      return res.status(200).json({
        success: true,
        message: "Unfriended successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const currentUserId = req.user?._id?.toString();
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const targetUserId = req.params.userId;
      const status = await friendRequestService.getFriendStatus(currentUserId, targetUserId);

      return res.status(200).json({
        success: true,
        data: status,
        message: "Friend status fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
