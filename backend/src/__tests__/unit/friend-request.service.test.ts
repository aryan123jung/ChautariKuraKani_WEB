const mockFriendRequestRepo = {
  findOne: jest.fn(),
  updateStatus: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  deleteById: jest.fn(),
  findAcceptedBetweenUsers: jest.fn(),
  listIncoming: jest.fn(),
  listOutgoing: jest.fn(),
  countAcceptedFriends: jest.fn()
};

const mockUserRepo = {
  getUserById: jest.fn()
};

const mockNotificationService = {
  createNotification: jest.fn()
};

jest.mock("../../repositories/friend-request.repository", () => ({
  FriendRequestRepository: jest.fn(() => mockFriendRequestRepo)
}));

jest.mock("../../repositories/user.repository", () => ({
  UserRepository: jest.fn(() => mockUserRepo)
}));

jest.mock("../../services/notification.services", () => ({
  NotificationService: jest.fn(() => mockNotificationService)
}));

import { FriendRequestService } from "../../services/friend-request.services";

describe("FriendRequestService (unit)", () => {
  const service = new FriendRequestService();
  const aliceId = "alice";
  const bobId = "bob";
  const requestId = "req1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects self friend request", async () => {
    await expect(service.sendRequest(aliceId, aliceId)).rejects.toMatchObject({ statusCode: 400 });
  });

  it("rejects when target user does not exist", async () => {
    mockUserRepo.getUserById.mockResolvedValueOnce(null);
    await expect(service.sendRequest(aliceId, bobId)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects duplicate pending friend request", async () => {
    mockUserRepo.getUserById.mockResolvedValue({ _id: bobId, firstName: "Bob" });
    mockFriendRequestRepo.findOne.mockResolvedValueOnce({ status: "PENDING" });
    await expect(service.sendRequest(aliceId, bobId)).rejects.toMatchObject({ statusCode: 409 });
  });

  it("auto-accepts reverse pending request", async () => {
    mockUserRepo.getUserById.mockResolvedValue({ _id: bobId, firstName: "Bob" });
    mockFriendRequestRepo.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ _id: requestId, status: "PENDING" });
    mockFriendRequestRepo.updateStatus.mockResolvedValue({ _id: requestId, status: "ACCEPTED" });

    const result = await service.sendRequest(aliceId, bobId);

    expect(result.autoAccepted).toBe(true);
    expect(mockNotificationService.createNotification).toHaveBeenCalled();
  });

  it("creates a new pending request", async () => {
    mockUserRepo.getUserById
      .mockResolvedValueOnce({ _id: bobId, firstName: "Bob" })
      .mockResolvedValueOnce({ _id: aliceId, firstName: "Alice" });
    mockFriendRequestRepo.findOne.mockResolvedValue(null);
    mockFriendRequestRepo.create.mockResolvedValue({ _id: requestId });
    mockFriendRequestRepo.findById.mockResolvedValue({ _id: requestId, status: "PENDING" });

    const result = await service.sendRequest(aliceId, bobId);

    expect(result.autoAccepted).toBe(false);
    expect(result.request).toBeTruthy();
    expect((result.request as any)._id).toBe(requestId);
  });

  it("cancels pending request", async () => {
    mockFriendRequestRepo.findOne.mockResolvedValue({ _id: requestId });
    mockFriendRequestRepo.deleteById.mockResolvedValue(true);
    await expect(service.cancelRequest(aliceId, bobId)).resolves.toBe(true);
  });

  it("fails to cancel missing request", async () => {
    mockFriendRequestRepo.findOne.mockResolvedValue(null);
    await expect(service.cancelRequest(aliceId, bobId)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("accepts incoming request by receiver", async () => {
    mockFriendRequestRepo.findById.mockResolvedValue({
      _id: requestId,
      status: "PENDING",
      toUserId: { _id: bobId },
      fromUserId: { _id: aliceId },
      fromUserIdString: aliceId
    });
    mockFriendRequestRepo.updateStatus.mockResolvedValue({ _id: requestId, status: "ACCEPTED" });

    const result = await service.acceptRequest(requestId, bobId);
    expect(result).toBeTruthy();
    expect((result as any).status).toBe("ACCEPTED");
  });

  it("rejects accept by non-receiver", async () => {
    mockFriendRequestRepo.findById.mockResolvedValue({
      _id: requestId,
      status: "PENDING",
      toUserId: { _id: bobId }
    });
    await expect(service.acceptRequest(requestId, aliceId)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("gets outgoing requests pagination", async () => {
    mockFriendRequestRepo.listOutgoing.mockResolvedValue({
      requests: [{ _id: requestId }],
      total: 1
    });

    const result = await service.getOutgoingRequests(aliceId, "1", "10");
    expect(result.pagination.totalRequests).toBe(1);
  });

  it("returns FRIEND status for accepted relationship", async () => {
    mockFriendRequestRepo.findOne.mockResolvedValue({ _id: requestId, status: "ACCEPTED" });
    const result = await service.getFriendStatus(aliceId, bobId);
    expect(result.status).toBe("FRIEND");
  });

  it("returns count of accepted friends", async () => {
    mockUserRepo.getUserById.mockResolvedValue({ _id: aliceId });
    mockFriendRequestRepo.countAcceptedFriends.mockResolvedValue(4);
    const result = await service.getFriendCount(aliceId);
    expect(result.count).toBe(4);
  });
});
