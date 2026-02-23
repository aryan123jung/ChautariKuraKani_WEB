import mongoose, { Document, Schema } from "mongoose";

export type CallStatus = "RINGING" | "ACCEPTED" | "REJECTED" | "MISSED" | "ENDED";
export type CallType = "audio" | "video";

export interface ICallLog extends Document {
  _id: mongoose.Types.ObjectId;
  callerId: mongoose.Types.ObjectId;
  calleeId: mongoose.Types.ObjectId;
  status: CallStatus;
  callType: CallType;
  startedAt?: Date;
  endedAt?: Date;
  durationSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const callLogSchema = new Schema<ICallLog>(
  {
    callerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    calleeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["RINGING", "ACCEPTED", "REJECTED", "MISSED", "ENDED"],
      default: "RINGING"
    },
    callType: {
      type: String,
      enum: ["audio", "video"],
      default: "audio"
    },
    startedAt: {
      type: Date
    },
    endedAt: {
      type: Date
    },
    durationSeconds: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

callLogSchema.index({ callerId: 1, createdAt: -1 });
callLogSchema.index({ calleeId: 1, createdAt: -1 });
callLogSchema.index({ status: 1, createdAt: -1 });

export const CallLogModel = mongoose.model<ICallLog>("CallLog", callLogSchema);
