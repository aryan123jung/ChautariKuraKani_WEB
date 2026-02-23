import { HttpError } from "../errors/http-error";
import { CallType } from "../models/call-log.model";
import { CallLogRepository } from "../repositories/call-log.repository";
import { FriendRequestRepository } from "../repositories/friend-request.repository";
import { UserRepository } from "../repositories/user.repository";

const callRepo = new CallLogRepository();
const friendRepo = new FriendRequestRepository();
const userRepo = new UserRepository();

export class CallService {
  private getPagination(page?: string, size?: string) {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 20;
    return { pageNumber, pageSize };
  }

  async initiateCall(callerId: string, calleeId: string, callType: CallType = "audio") {
    if (callerId === calleeId) {
      throw new HttpError(400, "You cannot call yourself");
    }

    const callee = await userRepo.getUserById(calleeId);
    if (!callee) {
      throw new HttpError(404, "Callee not found");
    }

    const isFriend = await friendRepo.findAcceptedBetweenUsers(callerId, calleeId);
    if (!isFriend) {
      throw new HttpError(403, "You can only call friends");
    }

    return await callRepo.create({
      callerId: callerId as any,
      calleeId: calleeId as any,
      status: "RINGING",
      callType
    });
  }

  async getCallById(callId: string) {
    const call = await callRepo.findById(callId);
    if (!call) {
      throw new HttpError(404, "Call not found");
    }
    return call;
  }

  async acceptCall(callId: string) {
    return await callRepo.updateStatus(callId, "ACCEPTED", { startedAt: new Date() });
  }

  async rejectCall(callId: string) {
    return await callRepo.updateStatus(callId, "REJECTED", { endedAt: new Date() });
  }

  async missCall(callId: string) {
    return await callRepo.updateStatus(callId, "MISSED", { endedAt: new Date() });
  }

  async endCall(callId: string) {
    const current = await this.getCallById(callId);
    const endedAt = new Date();
    const durationSeconds = current.startedAt
      ? Math.max(0, Math.floor((endedAt.getTime() - current.startedAt.getTime()) / 1000))
      : 0;

    return await callRepo.updateStatus(callId, "ENDED", {
      endedAt,
      durationSeconds
    });
  }

  async listMyCalls(userId: string, page?: string, size?: string) {
    const { pageNumber, pageSize } = this.getPagination(page, size);
    const { calls, total } = await callRepo.listByUser(userId, pageNumber, pageSize);

    return {
      calls,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalCalls: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
}
