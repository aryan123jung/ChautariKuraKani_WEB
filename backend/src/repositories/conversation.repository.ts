import { QueryFilter } from "mongoose";
import { ConversationModel, IConversation } from "../models/conversation.model";

export class ConversationRepository {
  async findByParticipantsKey(participantsKey: string) {
    return await ConversationModel.findOne({ participantsKey })
      .populate("participants", "firstName lastName username profileUrl");
  }

  async create(data: Partial<IConversation>) {
    const conversation = new ConversationModel(data);
    return await conversation.save();
  }

  async findByIdAndParticipant(conversationId: string, userId: string) {
    return await ConversationModel.findOne({
      _id: conversationId as any,
      participants: userId as any
    })
      .populate("participants", "firstName lastName username profileUrl");
  }

  async listByUser(userId: string, page: number, size: number) {
    const filter: QueryFilter<IConversation> = {
      participants: userId as any
    };

    const [conversations, total] = await Promise.all([
      ConversationModel.find(filter)
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("participants", "firstName lastName username profileUrl"),
      ConversationModel.countDocuments(filter)
    ]);

    return { conversations, total };
  }

  async updateLastMessage(conversationId: string, text: string) {
    return await ConversationModel.findByIdAndUpdate(
      conversationId,
      { lastMessage: text, lastMessageAt: new Date() },
      { new: true }
    )
      .populate("participants", "firstName lastName username profileUrl");
  }
}
