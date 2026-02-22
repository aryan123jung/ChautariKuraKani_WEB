import { QueryFilter } from "mongoose";
import { INotification, NotificationModel } from "../models/notification.model";

export class NotificationRepository {
  async create(data: Partial<INotification>) {
    const notification = new NotificationModel(data);
    return await notification.save();
  }

  async findById(id: string) {
    return await NotificationModel.findById(id)
      .populate("actorUserId", "firstName lastName username profileUrl");
  }

  async listByUser(userId: string, page: number, size: number) {
    const filter: QueryFilter<INotification> = {
      userId: userId as any
    };

    const [notifications, total] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("actorUserId", "firstName lastName username profileUrl"),
      NotificationModel.countDocuments(filter)
    ]);

    return { notifications, total };
  }

  async markRead(id: string) {
    return await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).populate("actorUserId", "firstName lastName username profileUrl");
  }

  async markAllRead(userId: string) {
    return await NotificationModel.updateMany(
      { userId: userId as any, isRead: false },
      { $set: { isRead: true } }
    );
  }
}
