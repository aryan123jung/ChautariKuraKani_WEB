import mongoose, { Document, Schema } from "mongoose";

export const SANCTION_TYPES = ["warning", "mute", "suspension", "ban", "content_restriction"] as const;
export const SANCTION_SCOPES = ["global", "posts", "comments", "messages", "communities"] as const;
export const SANCTION_STATUSES = ["active", "expired", "revoked"] as const;

export interface IUserSanction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  issuedBy: mongoose.Types.ObjectId;
  type: (typeof SANCTION_TYPES)[number];
  scope: (typeof SANCTION_SCOPES)[number];
  reason: string;
  status: (typeof SANCTION_STATUSES)[number];
  startsAt: Date;
  endsAt?: Date;
  metadata: Record<string, any>;
  revokedBy?: mongoose.Types.ObjectId;
  revokedAt?: Date;
  revokeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSanctionSchema = new Schema<IUserSanction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: SANCTION_TYPES,
      required: true
    },
    scope: {
      type: String,
      enum: SANCTION_SCOPES,
      default: "global"
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: SANCTION_STATUSES,
      default: "active"
    },
    startsAt: {
      type: Date,
      default: Date.now
    },
    endsAt: {
      type: Date,
      required: false
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    revokedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    revokedAt: {
      type: Date,
      required: false
    },
    revokeReason: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

userSanctionSchema.index({ userId: 1, status: 1, type: 1 });
userSanctionSchema.index({ issuedBy: 1, createdAt: -1 });
userSanctionSchema.index({ endsAt: 1 });

export const UserSanctionModel = mongoose.model<IUserSanction>("UserSanction", userSanctionSchema);
