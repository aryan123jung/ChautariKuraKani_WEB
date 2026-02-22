import mongoose, { Document, Schema } from "mongoose";

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface IFriendRequest extends Document {
  _id: mongoose.Types.ObjectId;
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

friendRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
friendRequestSchema.index({ toUserId: 1, status: 1, createdAt: -1 });
friendRequestSchema.index({ fromUserId: 1, status: 1, createdAt: -1 });

export const FriendRequestModel = mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);
