import { QueryFilter, Types } from "mongoose";
import { IMessage, MessageModel } from "../models/message.model";

export class MessageRepository {
  async create(data: Partial<IMessage>) {
    const message = new MessageModel(data);
    return await message.save();
  }

  async listByConversation(conversationId: string, page: number, size: number) {
    const filter: QueryFilter<IMessage> = {
      conversationId: conversationId as any
    };

    const [messages, total] = await Promise.all([
      MessageModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("senderId", "firstName lastName username profileUrl")
        .populate("receiverId", "firstName lastName username profileUrl"),
      MessageModel.countDocuments(filter)
    ]);

    return { messages, total };
  }

  async markConversationRead(conversationId: string, userId: string) {
    return await MessageModel.updateMany(
      {
        conversationId: conversationId as any,
        receiverId: userId as any,
        readBy: { $ne: new Types.ObjectId(userId) }
      },
      { $addToSet: { readBy: new Types.ObjectId(userId) } }
    );
  }
}
