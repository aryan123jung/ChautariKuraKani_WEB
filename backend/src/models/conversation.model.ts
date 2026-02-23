import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  participantsKey: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    participantsKey: {
      type: String,
      required: true,
      unique: true
    },
    lastMessage: {
      type: String
    },
    lastMessageAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
