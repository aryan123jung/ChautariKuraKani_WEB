import { HttpError } from "../errors/http-error";
import { ConversationRepository } from "../repositories/conversation.repository";
import { FriendRequestRepository } from "../repositories/friend-request.repository";
import { MessageRepository } from "../repositories/message.repository";
import { UserRepository } from "../repositories/user.repository";
import { emitMessageNew } from "../realtime/message-emitter";

const conversationRepo = new ConversationRepository();
const messageRepo = new MessageRepository();
const friendRepo = new FriendRequestRepository();
const userRepo = new UserRepository();

export class MessageService {
  private getPagination(page?: string, size?: string) {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 20;
    return { pageNumber, pageSize };
  }

  private buildParticipantsKey(userA: string, userB: string) {
    return [userA, userB].sort().join(":");
  }

  private getOtherParticipantId(conversation: any, currentUserId: string) {
    const participantIds = (conversation.participants || []).map((p: any) =>
      p?._id?.toString?.() || p.toString()
    );
    return participantIds.find((id: string) => id !== currentUserId) || null;
  }

  async getOrCreateConversation(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId) {
      throw new HttpError(400, "You cannot message yourself");
    }

    const otherUser = await userRepo.getUserById(otherUserId);
    if (!otherUser) {
      throw new HttpError(404, "Target user not found");
    }

    const isFriend = await friendRepo.findAcceptedBetweenUsers(currentUserId, otherUserId);
    if (!isFriend) {
      throw new HttpError(403, "You can only message friends");
    }

    const participantsKey = this.buildParticipantsKey(currentUserId, otherUserId);
    const existingConversation = await conversationRepo.findByParticipantsKey(participantsKey);
    if (existingConversation) return existingConversation;

    const conversation = await conversationRepo.create({
      participants: [currentUserId as any, otherUserId as any],
      participantsKey,
      lastMessage: "",
      lastMessageAt: new Date()
    });

    return await conversationRepo.findByIdAndParticipant(
      conversation._id.toString(),
      currentUserId
    );
  }

  async listConversations(currentUserId: string, page?: string, size?: string) {
    const { pageNumber, pageSize } = this.getPagination(page, size);
    const { conversations, total } = await conversationRepo.listByUser(
      currentUserId,
      pageNumber,
      pageSize
    );

    return {
      conversations,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalConversations: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async listMessages(
    currentUserId: string,
    conversationId: string,
    page?: string,
    size?: string
  ) {
    const conversation = await conversationRepo.findByIdAndParticipant(
      conversationId,
      currentUserId
    );
    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    const { pageNumber, pageSize } = this.getPagination(page, size);
    const { messages, total } = await messageRepo.listByConversation(
      conversationId,
      pageNumber,
      pageSize
    );

    return {
      messages,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalMessages: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async sendMessage(currentUserId: string, conversationId: string, text?: string) {
    if (!text || !text.trim()) {
      throw new HttpError(400, "Message text is required");
    }

    const conversation = await conversationRepo.findByIdAndParticipant(
      conversationId,
      currentUserId
    );
    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    const otherUserId = this.getOtherParticipantId(conversation, currentUserId);
    if (!otherUserId) {
      throw new HttpError(400, "Invalid conversation participants");
    }

    const isFriend = await friendRepo.findAcceptedBetweenUsers(currentUserId, otherUserId);
    if (!isFriend) {
      throw new HttpError(403, "You can only message friends");
    }

    const message = await messageRepo.create({
      conversationId: conversationId as any,
      senderId: currentUserId as any,
      receiverId: otherUserId as any,
      text: text.trim(),
      readBy: [currentUserId as any]
    });

    await conversationRepo.updateLastMessage(conversationId, text.trim());

    const { messages } = await messageRepo.listByConversation(conversationId, 1, 1);
    const latestMessage = messages[0] || (message as any);

    emitMessageNew({
      senderId: currentUserId,
      receiverId: otherUserId,
      conversationId,
      message: latestMessage as any
    });

    return latestMessage;
  }

  async markConversationRead(currentUserId: string, conversationId: string) {
    const conversation = await conversationRepo.findByIdAndParticipant(
      conversationId,
      currentUserId
    );
    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    await messageRepo.markConversationRead(conversationId, currentUserId);
    return true;
  }
}
