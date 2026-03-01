import mongoose, { Document, Schema } from "mongoose";

export const REPORT_TARGET_TYPES = ["user", "post", "community"] as const;
export const REPORT_REASON_TYPES = [
  "spam",
  "harassment",
  "hate",
  "violence",
  "nudity",
  "scam",
  "misinformation",
  "impersonation",
  "other"
] as const;
export const REPORT_STATUS_TYPES = ["pending", "in_review", "resolved", "rejected", "escalated"] as const;
export const REPORT_PRIORITY_TYPES = ["low", "medium", "high", "critical"] as const;
export const REPORT_ACTION_TYPES = [
  "none",
  "ban",
  "suspend",
  "delete"
] as const;

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  targetType: (typeof REPORT_TARGET_TYPES)[number];
  targetId: mongoose.Types.ObjectId;
  reasonType: (typeof REPORT_REASON_TYPES)[number];
  reasonText?: string;
  evidenceUrls: string[];
  status: (typeof REPORT_STATUS_TYPES)[number];
  priority: (typeof REPORT_PRIORITY_TYPES)[number];
  assignedTo?: mongoose.Types.ObjectId;
  actionTaken: (typeof REPORT_ACTION_TYPES)[number];
  resolutionNote?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetType: {
      type: String,
      enum: REPORT_TARGET_TYPES,
      required: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    reasonType: {
      type: String,
      enum: REPORT_REASON_TYPES,
      required: true
    },
    reasonText: {
      type: String,
      trim: true,
      default: ""
    },
    evidenceUrls: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: REPORT_STATUS_TYPES,
      default: "pending"
    },
    priority: {
      type: String,
      enum: REPORT_PRIORITY_TYPES,
      default: "medium"
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    actionTaken: {
      type: String,
      enum: REPORT_ACTION_TYPES,
      default: "none"
    },
    resolutionNote: {
      type: String,
      trim: true,
      default: ""
    },
    resolvedAt: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ status: 1, priority: 1, createdAt: -1 });
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ reporterId: 1, createdAt: -1 });
reportSchema.index({ assignedTo: 1, status: 1 });

export const ReportModel = mongoose.model<IReport>("Report", reportSchema);
