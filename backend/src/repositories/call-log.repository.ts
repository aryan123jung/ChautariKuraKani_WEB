import { QueryFilter } from "mongoose";
import { CallLogModel, CallStatus, ICallLog } from "../models/call-log.model";

export class CallLogRepository {
  async create(data: Partial<ICallLog>) {
    const log = new CallLogModel(data);
    return await log.save();
  }

  async findById(callId: string) {
    return await CallLogModel.findById(callId)
      .populate("callerId", "firstName lastName username profileUrl")
      .populate("calleeId", "firstName lastName username profileUrl");
  }

  async updateStatus(callId: string, status: CallStatus, extra: Partial<ICallLog> = {}) {
    return await CallLogModel.findByIdAndUpdate(
      callId,
      { status, ...extra },
      { new: true }
    )
      .populate("callerId", "firstName lastName username profileUrl")
      .populate("calleeId", "firstName lastName username profileUrl");
  }

  async listByUser(userId: string, page: number, size: number) {
    const filter: QueryFilter<ICallLog> = {
      $or: [{ callerId: userId as any }, { calleeId: userId as any }]
    };

    const [calls, total] = await Promise.all([
      CallLogModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("callerId", "firstName lastName username profileUrl")
        .populate("calleeId", "firstName lastName username profileUrl"),
      CallLogModel.countDocuments(filter)
    ]);

    return { calls, total };
  }
}
