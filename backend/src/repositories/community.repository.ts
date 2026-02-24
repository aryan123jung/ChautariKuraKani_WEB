import { QueryFilter, Types } from "mongoose";
import { CommunityModel, ICommunity } from "../models/community.model";

export class CommunityRepository {
  async create(data: Partial<ICommunity>) {
    const community = new CommunityModel(data);
    return await community.save();
  }

  async findById(id: string) {
    return await CommunityModel.findById(id)
      .populate("creatorId", "firstName lastName username profileUrl")
      .populate("members", "firstName lastName username profileUrl");
  }

  async findBySlug(slug: string) {
    return await CommunityModel.findOne({ slug })
      .populate("creatorId", "firstName lastName username profileUrl")
      .populate("members", "firstName lastName username profileUrl");
  }

  async searchBySlugPrefix(slugPrefix: string, page: number, size: number) {
    const filter: QueryFilter<ICommunity> = {
      slug: { $regex: `^${slugPrefix}`, $options: "i" }
    };

    const [communities, total] = await Promise.all([
      CommunityModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("creatorId", "firstName lastName username profileUrl"),
      CommunityModel.countDocuments(filter)
    ]);

    return { communities, total };
  }

  async listByMember(userId: string, page: number, size: number) {
    const filter: QueryFilter<ICommunity> = {
      members: userId as any
    };

    const [communities, total] = await Promise.all([
      CommunityModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .populate("creatorId", "firstName lastName username profileUrl"),
      CommunityModel.countDocuments(filter)
    ]);

    return { communities, total };
  }

  async countByMember(userId: string) {
    return await CommunityModel.countDocuments({
      members: userId as any
    });
  }

  async countByCreator(userId: string) {
    return await CommunityModel.countDocuments({
      creatorId: userId as any
    });
  }

  async join(communityId: string, userId: string) {
    return await CommunityModel.findByIdAndUpdate(
      communityId,
      { $addToSet: { members: new Types.ObjectId(userId) } },
      { new: true }
    )
      .populate("creatorId", "firstName lastName username profileUrl")
      .populate("members", "firstName lastName username profileUrl");
  }

  async leave(communityId: string, userId: string) {
    return await CommunityModel.findByIdAndUpdate(
      communityId,
      { $pull: { members: new Types.ObjectId(userId) } },
      { new: true }
    )
      .populate("creatorId", "firstName lastName username profileUrl")
      .populate("members", "firstName lastName username profileUrl");
  }

  async isMember(communityId: string, userId: string) {
    const community = await CommunityModel.findOne({
      _id: communityId as any,
      members: userId as any
    }).select("_id");

    return !!community;
  }

  async deleteById(communityId: string) {
    return await CommunityModel.findByIdAndDelete(communityId);
  }

  async updateById(communityId: string, data: Partial<ICommunity>) {
    return await CommunityModel.findByIdAndUpdate(communityId, data, { new: true })
      .populate("creatorId", "firstName lastName username profileUrl")
      .populate("members", "firstName lastName username profileUrl");
  }
}
