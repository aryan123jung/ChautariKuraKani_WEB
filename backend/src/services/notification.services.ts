import { HttpError } from "../errors/http-error";
import { NotificationType } from "../models/notification.model";
import { emitNotificationNew } from "../realtime/notification-emitter";
import { NotificationRepository } from "../repositories/notification.repository";

const notificationRepo = new NotificationRepository();

export class NotificationService {
  async createNotification(
    userId: string,
    actorUserId: string,
    type: NotificationType,
    entityId: string,
    title: string,
    message: string
  ) {
    const notification = await notificationRepo.create({
      userId: userId as any,
      actorUserId: actorUserId as any,
      type,
      entityType: "friend_request",
      entityId,
      title,
      message,
      isRead: false
    });

    const fullNotification = await notificationRepo.findById(notification._id.toString());
    if (fullNotification) {
      emitNotificationNew(userId, fullNotification as any);
      return fullNotification;
    }
    return notification;
  }

  async listUserNotifications(userId: string, page?: string, size?: string) {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const { notifications, total } = await notificationRepo.listByUser(
      userId,
      pageNumber,
      pageSize
    );

    return {
      notifications,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalNotifications: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async markNotificationRead(notificationId: string, userId: string) {
    const notification = await notificationRepo.findById(notificationId);
    if (!notification) {
      throw new HttpError(404, "Notification not found");
    }

    if (notification.userId?.toString() !== userId) {
      throw new HttpError(403, "You can only mark your own notifications");
    }

    const updated = await notificationRepo.markRead(notificationId);
    return updated;
  }

  async markAllRead(userId: string) {
    await notificationRepo.markAllRead(userId);
    return true;
  }
}
