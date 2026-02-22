import mongoose, { Document, Schema } from "mongoose";

export type NotificationType =
  | "FRIEND_REQUEST_SENT"
  | "FRIEND_REQUEST_ACCEPTED"
  | "POST_LIKED"
  | "POST_COMMENTED";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  actorUserId: mongoose.Types.ObjectId;
  type: NotificationType;
  entityType: "friend_request";
  entityId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: [
        "FRIEND_REQUEST_SENT",
        "FRIEND_REQUEST_ACCEPTED",
        "POST_LIKED",
        "POST_COMMENTED"
      ],
      required: true
    },
    entityType: {
      type: String,
      enum: ["friend_request"],
      default: "friend_request"
    },
    entityId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export const NotificationModel = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
