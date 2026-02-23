import { QueryFilter } from "mongoose";
import {
  FriendRequestModel,
  IFriendRequest
} from "../models/friend-request.model";

export class FriendRequestRepository {
  async create(data: Partial<IFriendRequest>) {
    const request = new FriendRequestModel(data);
    return await request.save();
  }

  async findById(id: string) {
    return await FriendRequestModel.findById(id)
      .populate("fromUserId", "firstName lastName username profileUrl")
      .populate("toUserId", "firstName lastName username profileUrl");
  }

  async findOne(filter: QueryFilter<IFriendRequest>) {
    return await FriendRequestModel.findOne(filter)
      .populate("fromUserId", "firstName lastName username profileUrl")
      .populate("toUserId", "firstName lastName username profileUrl");
  }

  async updateStatus(id: string, status: "PENDING" | "ACCEPTED" | "REJECTED") {
    return await FriendRequestModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate("fromUserId", "firstName lastName username profileUrl")
      .populate("toUserId", "firstName lastName username profileUrl");
  }

  async deleteById(id: string) {
    return await FriendRequestModel.findByIdAndDelete(id);
  }

  async listIncoming(userId: string, page: number, size: number) {
    const filter: QueryFilter<IFriendRequest> = {
      toUserId: userId as any,
      status: "PENDING"
    };

    const [requests, total] = await Promise.all([
      FriendRequestModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("fromUserId", "firstName lastName username profileUrl")
        .populate("toUserId", "firstName lastName username profileUrl"),
      FriendRequestModel.countDocuments(filter)
    ]);

    return { requests, total };
  }

  async listOutgoing(userId: string, page: number, size: number) {
    const filter: QueryFilter<IFriendRequest> = {
      fromUserId: userId as any,
      status: "PENDING"
    };

    const [requests, total] = await Promise.all([
      FriendRequestModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("fromUserId", "firstName lastName username profileUrl")
        .populate("toUserId", "firstName lastName username profileUrl"),
      FriendRequestModel.countDocuments(filter)
    ]);

    return { requests, total };
  }

  async findAcceptedBetweenUsers(userA: string, userB: string) {
    return await FriendRequestModel.findOne({
      status: "ACCEPTED",
      $or: [
        { fromUserId: userA as any, toUserId: userB as any },
        { fromUserId: userB as any, toUserId: userA as any }
      ]
    });
  }

  async countAcceptedFriends(userId: string) {
    return await FriendRequestModel.countDocuments({
      status: "ACCEPTED",
      $or: [{ fromUserId: userId as any }, { toUserId: userId as any }]
    });
  }
}
