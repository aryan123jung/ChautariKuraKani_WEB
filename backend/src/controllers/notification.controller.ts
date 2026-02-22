import { Request, Response } from "express";
import { NotificationService } from "../services/notification.services";
import { QueryParams } from "../types/query.type";

const notificationService = new NotificationService();

export class NotificationController {
  async listNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { page, size }: QueryParams = req.query;
      const { notifications, pagination } =
        await notificationService.listUserNotifications(userId, page, size);

      return res.status(200).json({
        success: true,
        data: notifications,
        pagination,
        message: "Notifications fetched successfully"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async markRead(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const notificationId = req.params.id;
      const notification = await notificationService.markNotificationRead(
        notificationId,
        userId
      );

      return res.status(200).json({
        success: true,
        data: notification,
        message: "Notification marked as read"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async markAllRead(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      await notificationService.markAllRead(userId);
      return res.status(200).json({
        success: true,
        message: "All notifications marked as read"
      });
    } catch (error: Error | any) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
