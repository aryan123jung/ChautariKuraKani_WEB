const mockConversationRepo = {
  findByParticipantsKey: jest.fn(),
  create: jest.fn(),
  findByIdAndParticipant: jest.fn(),
  listByUser: jest.fn(),
  updateLastMessage: jest.fn()
};

const mockMessageRepo = {
  listByConversation: jest.fn(),
  create: jest.fn(),
  markConversationRead: jest.fn()
};

const mockFriendRepo = {
  findAcceptedBetweenUsers: jest.fn()
};

const mockUserRepo = {
  getUserById: jest.fn()
};

const emitMessageNew = jest.fn();

jest.mock("../../repositories/conversation.repository", () => ({
  ConversationRepository: jest.fn(() => mockConversationRepo)
}));

jest.mock("../../repositories/message.repository", () => ({
  MessageRepository: jest.fn(() => mockMessageRepo)
}));

jest.mock("../../repositories/friend-request.repository", () => ({
  FriendRequestRepository: jest.fn(() => mockFriendRepo)
}));

jest.mock("../../repositories/user.repository", () => ({
  UserRepository: jest.fn(() => mockUserRepo)
}));

jest.mock("../../realtime/message-emitter", () => ({
  emitMessageNew: (...args: any[]) => emitMessageNew(...args)
}));

import { MessageService } from "../../services/message.services";

describe("MessageService (unit)", () => {
  const service = new MessageService();
  const aliceId = "alice";
  const bobId = "bob";
  const conversationId = "conv1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects self conversation", async () => {
    await expect(service.getOrCreateConversation(aliceId, aliceId)).rejects.toMatchObject({ statusCode: 400 });
  });

  it("rejects conversation when target user not found", async () => {
    mockUserRepo.getUserById.mockResolvedValue(null);
    await expect(service.getOrCreateConversation(aliceId, bobId)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects conversation when users are not friends", async () => {
    mockUserRepo.getUserById.mockResolvedValue({ _id: bobId });
    mockFriendRepo.findAcceptedBetweenUsers.mockResolvedValue(null);
    await expect(service.getOrCreateConversation(aliceId, bobId)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("returns existing conversation when found", async () => {
    mockUserRepo.getUserById.mockResolvedValue({ _id: bobId });
    mockFriendRepo.findAcceptedBetweenUsers.mockResolvedValue({ _id: "fr1" });
    mockConversationRepo.findByParticipantsKey.mockResolvedValue({ _id: conversationId });

    const result = await service.getOrCreateConversation(aliceId, bobId);
    expect(result).toBeTruthy();
    expect((result as any)._id).toBe(conversationId);
  });

  it("creates conversation when not existing", async () => {
    mockUserRepo.getUserById.mockResolvedValue({ _id: bobId });
    mockFriendRepo.findAcceptedBetweenUsers.mockResolvedValue({ _id: "fr1" });
    mockConversationRepo.findByParticipantsKey.mockResolvedValue(null);
    mockConversationRepo.create.mockResolvedValue({ _id: conversationId });
    mockConversationRepo.findByIdAndParticipant.mockResolvedValue({ _id: conversationId });

    const result = await service.getOrCreateConversation(aliceId, bobId);
    expect(mockConversationRepo.create).toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect((result as any)._id).toBe(conversationId);
  });

  it("lists user conversations with pagination", async () => {
    mockConversationRepo.listByUser.mockResolvedValue({ conversations: [{ _id: conversationId }], total: 1 });
    const result = await service.listConversations(aliceId, "1", "20");
    expect(result.pagination.totalConversations).toBe(1);
  });

  it("rejects listing messages for inaccessible conversation", async () => {
    mockConversationRepo.findByIdAndParticipant.mockResolvedValue(null);
    await expect(service.listMessages(aliceId, conversationId)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("lists messages for conversation participant", async () => {
    mockConversationRepo.findByIdAndParticipant.mockResolvedValue({ _id: conversationId });
    mockMessageRepo.listByConversation.mockResolvedValue({ messages: [{ _id: "m1" }], total: 1 });
    const result = await service.listMessages(aliceId, conversationId);
    expect(result.pagination.totalMessages).toBe(1);
  });

  it("rejects empty outgoing text", async () => {
    await expect(service.sendMessage(aliceId, conversationId, "   ")).rejects.toMatchObject({ statusCode: 400 });
  });

  it("sends message and emits event", async () => {
    mockConversationRepo.findByIdAndParticipant.mockResolvedValue({
      _id: conversationId,
      participants: [{ _id: aliceId }, { _id: bobId }]
    });
    mockFriendRepo.findAcceptedBetweenUsers.mockResolvedValue({ _id: "fr1" });
    mockMessageRepo.create.mockResolvedValue({ _id: "m1" });
    mockConversationRepo.updateLastMessage.mockResolvedValue(true);
    mockMessageRepo.listByConversation.mockResolvedValue({ messages: [{ _id: "m1", text: "hello" }], total: 1 });

    const result = await service.sendMessage(aliceId, conversationId, "hello");

    expect(mockMessageRepo.create).toHaveBeenCalled();
    expect(mockConversationRepo.updateLastMessage).toHaveBeenCalledWith(conversationId, "hello");
    expect(emitMessageNew).toHaveBeenCalled();
    expect(result._id).toBe("m1");
  });

  it("marks conversation as read", async () => {
    mockConversationRepo.findByIdAndParticipant.mockResolvedValue({ _id: conversationId });
    mockMessageRepo.markConversationRead.mockResolvedValue(true);
    await expect(service.markConversationRead(aliceId, conversationId)).resolves.toBe(true);
  });
});
