import { HttpError } from "../errors/http-error";
import { FriendRequestRepository } from "../repositories/friend-request.repository";
import { UserRepository } from "../repositories/user.repository";
import { NotificationService } from "./notification.services";

const friendRequestRepo = new FriendRequestRepository();
const userRepo = new UserRepository();
const notificationService = new NotificationService();

export class FriendRequestService {
  private getDisplayName(userRef: any) {
    return userRef?.firstName || "Someone";
  }

  private getPagination(page?: string, size?: string) {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;
    return { pageNumber, pageSize };
  }

  async sendRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new HttpError(400, "You cannot send friend request to yourself");
    }

    const toUser = await userRepo.getUserById(toUserId);
    if (!toUser) {
      throw new HttpError(404, "Target user not found");
    }
    const fromUser = await userRepo.getUserById(fromUserId);

    const existingSameDirection = await friendRequestRepo.findOne({
      fromUserId: fromUserId as any,
      toUserId: toUserId as any
    });

    if (existingSameDirection?.status === "PENDING") {
      throw new HttpError(409, "Friend request already sent");
    }
    if (existingSameDirection?.status === "ACCEPTED") {
      throw new HttpError(409, "You are already friends");
    }
    if (existingSameDirection?.status === "REJECTED") {
      const reactivated = await friendRequestRepo.updateStatus(
        existingSameDirection._id.toString(),
        "PENDING"
      );
      return { request: reactivated, autoAccepted: false };
    }

    const reverseDirection = await friendRequestRepo.findOne({
      fromUserId: toUserId as any,
      toUserId: fromUserId as any
    });

    // If target user already sent pending request, auto-accept it.
    if (reverseDirection?.status === "PENDING") {
      const accepted = await friendRequestRepo.updateStatus(
        reverseDirection._id.toString(),
        "ACCEPTED"
      );
      if (accepted) {
        await notificationService.createNotification(
          toUserId,
          fromUserId,
          "FRIEND_REQUEST_ACCEPTED",
          accepted._id.toString(),
          "Friend Request Accepted",
          `${fromUser?.firstName || "Someone"} accepted your friend request`
        );
      }
      return {
        request: accepted,
        autoAccepted: true
      };
    }
    if (reverseDirection?.status === "ACCEPTED") {
      throw new HttpError(409, "You are already friends");
    }

    const request = await friendRequestRepo.create({
      fromUserId: fromUserId as any,
      toUserId: toUserId as any,
      status: "PENDING"
    });

    const fullRequest = await friendRequestRepo.findById(request._id.toString());

    await notificationService.createNotification(
      toUserId,
      fromUserId,
      "FRIEND_REQUEST_SENT",
      request._id.toString(),
      "New Friend Request",
      `${fromUser?.firstName || "Someone"} sent you a friend request`
    );

    return { request: fullRequest, autoAccepted: false };
  }

  async cancelRequest(fromUserId: string, toUserId: string) {
    const request = await friendRequestRepo.findOne({
      fromUserId: fromUserId as any,
      toUserId: toUserId as any,
      status: "PENDING"
    });

    if (!request) {
      throw new HttpError(404, "Pending request not found");
    }

    await friendRequestRepo.deleteById(request._id.toString());
    return true;
  }

  async acceptRequest(requestId: string, currentUserId: string) {
    const request = await friendRequestRepo.findById(requestId);
    if (!request) {
      throw new HttpError(404, "Friend request not found");
    }

    if (request.toUserId?._id?.toString?.() !== currentUserId) {
      throw new HttpError(403, "Only receiver can accept request");
    }

    if (request.status !== "PENDING") {
      throw new HttpError(400, `Cannot accept request in ${request.status} state`);
    }

    const accepted = await friendRequestRepo.updateStatus(requestId, "ACCEPTED");

    if (accepted) {
      await notificationService.createNotification(
        request.fromUserId?._id?.toString?.() || request.fromUserId.toString(),
        currentUserId,
        "FRIEND_REQUEST_ACCEPTED",
        accepted._id.toString(),
        "Friend Request Accepted",
        `${this.getDisplayName(request.toUserId)} accepted your friend request`
      );
    }

    return accepted;
  }

  async rejectRequest(requestId: string, currentUserId: string) {
    const request = await friendRequestRepo.findById(requestId);
    if (!request) {
      throw new HttpError(404, "Friend request not found");
    }

    if (request.toUserId?._id?.toString?.() !== currentUserId) {
      throw new HttpError(403, "Only receiver can reject request");
    }

    if (request.status !== "PENDING") {
      throw new HttpError(400, `Cannot reject request in ${request.status} state`);
    }

    const rejected = await friendRequestRepo.updateStatus(requestId, "REJECTED");
    return rejected;
  }

  async unfriend(currentUserId: string, friendUserId: string) {
    const friendship = await friendRequestRepo.findAcceptedBetweenUsers(
      currentUserId,
      friendUserId
    );

    if (!friendship) {
      throw new HttpError(404, "Friendship not found");
    }

    await friendRequestRepo.deleteById(friendship._id.toString());
    return true;
  }

  async getIncomingRequests(currentUserId: string, page?: string, size?: string) {
    const { pageNumber, pageSize } = this.getPagination(page, size);
    const { requests, total } = await friendRequestRepo.listIncoming(
      currentUserId,
      pageNumber,
      pageSize
    );

    return {
      requests,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalRequests: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async getOutgoingRequests(currentUserId: string, page?: string, size?: string) {
    const { pageNumber, pageSize } = this.getPagination(page, size);
    const { requests, total } = await friendRequestRepo.listOutgoing(
      currentUserId,
      pageNumber,
      pageSize
    );

    return {
      requests,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalRequests: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async getFriendStatus(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      return { status: "SELF", requestId: null };
    }

    const request = await friendRequestRepo.findOne({
      $or: [
        { fromUserId: currentUserId as any, toUserId: targetUserId as any },
        { fromUserId: targetUserId as any, toUserId: currentUserId as any }
      ]
    });

    if (!request) {
      return { status: "NONE", requestId: null };
    }

    if (request.status === "ACCEPTED") {
      return { status: "FRIEND", requestId: request._id };
    }

    if (request.status === "PENDING") {
      const isOutgoing = request.fromUserId?._id?.toString?.() === currentUserId;
      return {
        status: isOutgoing ? "PENDING_OUTGOING" : "PENDING_INCOMING",
        requestId: request._id
      };
    }

    return { status: "NONE", requestId: null };
  }

  async getFriendCount(userId: string) {
    const user = await userRepo.getUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const count = await friendRequestRepo.countAcceptedFriends(userId);
    return { count };
  }
}
