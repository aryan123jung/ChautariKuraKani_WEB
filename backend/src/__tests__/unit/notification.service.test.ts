const mockNotificationRepo = {
  create: jest.fn(),
  findById: jest.fn(),
  listByUser: jest.fn(),
  markRead: jest.fn(),
  markAllRead: jest.fn()
};

const emitNotificationNew = jest.fn();

jest.mock("../../repositories/notification.repository", () => ({
  NotificationRepository: jest.fn(() => mockNotificationRepo)
}));

jest.mock("../../realtime/notification-emitter", () => ({
  emitNotificationNew: (...args: any[]) => emitNotificationNew(...args)
}));

import { NotificationService } from "../../services/notification.services";

describe("NotificationService (unit)", () => {
  const service = new NotificationService();
  const userId = "u1";
  const actorId = "u2";
  const notificationId = "n1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates notification and emits realtime event", async () => {
    mockNotificationRepo.create.mockResolvedValue({ _id: notificationId });
    mockNotificationRepo.findById.mockResolvedValue({ _id: notificationId, userId });

    const result = await service.createNotification(
      userId,
      actorId,
      "FRIEND_REQUEST_SENT",
      "entity1",
      "title",
      "message"
    );

    expect(result._id).toBe(notificationId);
    expect(emitNotificationNew).toHaveBeenCalledWith(userId, expect.any(Object));
  });

  it("lists user notifications with pagination", async () => {
    mockNotificationRepo.listByUser.mockResolvedValue({ notifications: [{ _id: notificationId }], total: 1 });
    const result = await service.listUserNotifications(userId, "1", "10");
    expect(result.pagination.totalNotifications).toBe(1);
  });

  it("marks own notification as read", async () => {
    mockNotificationRepo.findById.mockResolvedValue({ _id: notificationId, userId });
    mockNotificationRepo.markRead.mockResolvedValue({ _id: notificationId, isRead: true });

    const result = await service.markNotificationRead(notificationId, userId);
    expect(result).toBeTruthy();
    expect((result as any).isRead).toBe(true);
  });

  it("rejects marking unknown notification", async () => {
    mockNotificationRepo.findById.mockResolvedValue(null);
    await expect(service.markNotificationRead(notificationId, userId)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects marking another user's notification", async () => {
    mockNotificationRepo.findById.mockResolvedValue({ _id: notificationId, userId: actorId });
    await expect(service.markNotificationRead(notificationId, userId)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("marks all notifications as read", async () => {
    mockNotificationRepo.markAllRead.mockResolvedValue(true);
    await expect(service.markAllRead(userId)).resolves.toBe(true);
  });
});
