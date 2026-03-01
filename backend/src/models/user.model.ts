import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const userMongoSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        profileUrl: { type: String, required: false },
        coverUrl: { type: String, required: false },

        // Moderation/account lifecycle fields.
        accountStatus: {
            type: String,
            enum: ["active", "suspended", "banned", "deactivated"],
            default: "active"
        },
        suspensionUntil: { type: Date, required: false },
        isVerified: { type: Boolean, default: false },
        forceLogoutAt: { type: Date, required: false },
        tokenVersion: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

userMongoSchema.index({ accountStatus: 1, role: 1 });

export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    accountStatus: "active" | "suspended" | "banned" | "deactivated";
    suspensionUntil?: Date;
    isVerified: boolean;
    forceLogoutAt?: Date;
    tokenVersion: number;
}
export const UserModel = mongoose.model<IUser>("User", userMongoSchema);
