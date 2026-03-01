import mongoose, { Document, Schema } from "mongoose";

export const ADMIN_ACTION_STATUS_TYPES = ["success", "failed"] as const;
export const ADMIN_RESOURCE_TYPES = [
  "user",
  "post",
  "community",
  "report",
  "system"
] as const;

export interface IAdminActionLog extends Document {
  _id: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  action: string;
  resourceType: (typeof ADMIN_RESOURCE_TYPES)[number];
  resourceId?: string;
  status: (typeof ADMIN_ACTION_STATUS_TYPES)[number];
  reason?: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminActionLogSchema = new Schema<IAdminActionLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    resourceType: {
      type: String,
      enum: ADMIN_RESOURCE_TYPES,
      required: true
    },
    resourceId: {
      type: String,
      required: false,
      trim: true
    },
    status: {
      type: String,
      enum: ADMIN_ACTION_STATUS_TYPES,
      default: "success"
    },
    reason: {
      type: String,
      required: false,
      trim: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      required: false
    },
    userAgent: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

adminActionLogSchema.index({ adminId: 1, createdAt: -1 });
adminActionLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
adminActionLogSchema.index({ status: 1, createdAt: -1 });

export const AdminActionLogModel = mongoose.model<IAdminActionLog>("AdminActionLog", adminActionLogSchema);
