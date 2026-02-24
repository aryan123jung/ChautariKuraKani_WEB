import { HttpError } from "../errors/http-error";
import { CommunityRepository } from "../repositories/community.repository";
import { UserRepository } from "../repositories/user.repository";
import { PostRepository } from "../repositories/post.repository";

const communityRepo = new CommunityRepository();
const userRepo = new UserRepository();
const postRepo = new PostRepository();

export class CommunityService {
  private normalizeCommunityName(name: string) {
    return name.replace(/^c\//i, "").trim();
  }

  private toSlug(name: string) {
    return this.normalizeCommunityName(name)
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  private getPagination(page?: string, size?: string) {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;
    return { pageNumber, pageSize };
  }

  async createCommunity(
    userId: string,
    payload: { name?: string; description?: string; profileUrl?: string }
  ) {
    const rawName = payload.name;
    if (!rawName || !rawName.trim()) {
      throw new HttpError(400, "Community name is required");
    }

    const name = this.normalizeCommunityName(rawName);
    if (!name) {
      throw new HttpError(400, "Invalid community name");
    }

    const slug = this.toSlug(name);
    const existing = await communityRepo.findBySlug(slug);
    if (existing) {
      throw new HttpError(409, "Community already exists");
    }

    const community = await communityRepo.create({
      name,
      slug,
      description: payload.description || "",
      profileUrl: payload.profileUrl || "",
      creatorId: userId as any,
      members: [userId as any]
    });

    return await communityRepo.findById(community._id.toString());
  }

  async joinCommunity(userId: string, communityId: string) {
    const community = await communityRepo.findById(communityId);
    if (!community) {
      throw new HttpError(404, "Community not found");
    }

    return await communityRepo.join(communityId, userId);
  }

  async leaveCommunity(userId: string, communityId: string) {
    const community = await communityRepo.findById(communityId);
    if (!community) {
      throw new HttpError(404, "Community not found");
    }

    return await communityRepo.leave(communityId, userId);
  }

  async searchCommunities(query?: string, page?: string, size?: string) {
    if (!query || !query.trim()) {
      throw new HttpError(400, "Query is required (use format c/name)");
    }

    const trimmed = query.trim();
    if (!/^c\//i.test(trimmed)) {
      throw new HttpError(400, "Query must start with c/ (example: c/chautari)");
    }

    const searchKey = this.toSlug(trimmed);
    if (!searchKey) {
      throw new HttpError(400, "Invalid search query");
    }

    const { pageNumber, pageSize } = this.getPagination(page, size);
    const { communities, total } = await communityRepo.searchBySlugPrefix(
      searchKey,
      pageNumber,
      pageSize
    );

    return {
      communities,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalCommunities: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async getCommunityById(communityId: string) {
    const community = await communityRepo.findById(communityId);
    if (!community) {
      throw new HttpError(404, "Community not found");
    }
    return community;
  }

  async getMyCommunities(userId: string, page?: string, size?: string) {
    const { pageNumber, pageSize } = this.getPagination(page, size);
    const { communities, total } = await communityRepo.listByMember(
      userId,
      pageNumber,
      pageSize
    );

    return {
      communities,
      pagination: {
        page: pageNumber,
        size: pageSize,
        totalCommunities: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async getMemberCount(communityId: string) {
    const community = await communityRepo.findById(communityId);
    if (!community) {
      throw new HttpError(404, "Community not found");
    }

    return { count: (community.members || []).length };
  }

  async ensureJoined(userId: string, communityId: string) {
    const community = await communityRepo.findById(communityId);
    if (!community) {
      throw new HttpError(404, "Community not found");
    }

    const joined = await communityRepo.isMember(communityId, userId);
    if (!joined) {
      throw new HttpError(403, "Join this Chautari first to post");
    }
  }

  async deleteCommunity(currentUserId: string, communityId: string) {
    const community = await communityRepo.findById(communityId);
    if (!community) {
      throw new HttpError(404, "Community not found");
    }

    const creatorId =
      typeof community.creatorId === "string"
        ? community.creatorId
        : (community.creatorId as any)?._id?.toString?.() || community.creatorId.toString();

    if (creatorId !== currentUserId) {
      throw new HttpError(403, "Only Chautari creator can delete this community");
    }

    await postRepo.deleteByCommunityId(communityId);
    await communityRepo.deleteById(communityId);
    return true;
  }
}
