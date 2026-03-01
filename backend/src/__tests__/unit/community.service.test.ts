const mockCommunityRepo = {
  findBySlug: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  join: jest.fn(),
  leave: jest.fn(),
  searchBySlugPrefix: jest.fn(),
  listByMember: jest.fn(),
  countByMember: jest.fn(),
  countByCreator: jest.fn(),
  isMember: jest.fn(),
  deleteById: jest.fn(),
  updateById: jest.fn()
};

const mockUserRepo = {
  getUserById: jest.fn()
};

const mockPostRepo = {
  deleteByCommunityId: jest.fn()
};

jest.mock("../../repositories/community.repository", () => ({
  CommunityRepository: jest.fn(() => mockCommunityRepo)
}));

jest.mock("../../repositories/user.repository", () => ({
  UserRepository: jest.fn(() => mockUserRepo)
}));

jest.mock("../../repositories/post.repository", () => ({
  PostRepository: jest.fn(() => mockPostRepo)
}));

import { CommunityService } from "../../services/community.services";

describe("CommunityService (unit)", () => {
  const service = new CommunityService();
  const userId = "u1";
  const communityId = "c1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a community and normalizes name", async () => {
    mockCommunityRepo.findBySlug.mockResolvedValue(null);
    mockCommunityRepo.create.mockResolvedValue({ _id: "new-id" });
    mockCommunityRepo.findById.mockResolvedValue({ _id: "new-id", name: "Integration Club" });

    const result = await service.createCommunity(userId, { name: "c/Integration Club" });

    expect(mockCommunityRepo.findBySlug).toHaveBeenCalledWith("integration-club");
    expect(mockCommunityRepo.create).toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect((result as any)._id).toBe("new-id");
  });

  it("throws when creating community without name", async () => {
    await expect(service.createCommunity(userId, { name: "" })).rejects.toMatchObject({ statusCode: 400 });
  });

  it("throws when community already exists", async () => {
    mockCommunityRepo.findBySlug.mockResolvedValue({ _id: "existing" });
    await expect(service.createCommunity(userId, { name: "c/dupe" })).rejects.toMatchObject({ statusCode: 409 });
  });

  it("joins existing community", async () => {
    mockCommunityRepo.findById.mockResolvedValue({ _id: communityId });
    mockCommunityRepo.join.mockResolvedValue({ _id: communityId, members: [userId] });

    const result = await service.joinCommunity(userId, communityId);

    expect(mockCommunityRepo.join).toHaveBeenCalledWith(communityId, userId);
    expect(result).toBeTruthy();
    expect((result as any)._id).toBe(communityId);
  });

  it("throws when joining unknown community", async () => {
    mockCommunityRepo.findById.mockResolvedValue(null);
    await expect(service.joinCommunity(userId, communityId)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("searches communities by slug prefix", async () => {
    mockCommunityRepo.searchBySlugPrefix.mockResolvedValue({ communities: [{ _id: "c1" }], total: 1 });
    const result = await service.searchCommunities("c/tech", "1", "10");
    expect(mockCommunityRepo.searchBySlugPrefix).toHaveBeenCalledWith("tech", 1, 10);
    expect(result.pagination.totalCommunities).toBe(1);
  });

  it("throws when search query is missing prefix", async () => {
    await expect(service.searchCommunities("tech", "1", "10")).rejects.toMatchObject({ statusCode: 400 });
  });

  it("ensures member before posting", async () => {
    mockCommunityRepo.findById.mockResolvedValue({ _id: communityId });
    mockCommunityRepo.isMember.mockResolvedValue(true);
    await expect(service.ensureJoined(userId, communityId)).resolves.toBeUndefined();
  });

  it("throws when user is not member in ensureJoined", async () => {
    mockCommunityRepo.findById.mockResolvedValue({ _id: communityId });
    mockCommunityRepo.isMember.mockResolvedValue(false);
    await expect(service.ensureJoined(userId, communityId)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("deletes community when requester is creator", async () => {
    mockCommunityRepo.findById.mockResolvedValue({ _id: communityId, creatorId: userId });
    mockPostRepo.deleteByCommunityId.mockResolvedValue(true);
    mockCommunityRepo.deleteById.mockResolvedValue(true);

    const result = await service.deleteCommunity(userId, communityId);

    expect(mockPostRepo.deleteByCommunityId).toHaveBeenCalledWith(communityId);
    expect(mockCommunityRepo.deleteById).toHaveBeenCalledWith(communityId);
    expect(result).toBe(true);
  });

  it("throws delete when requester is not creator", async () => {
    mockCommunityRepo.findById.mockResolvedValue({ _id: communityId, creatorId: "someone-else" });
    await expect(service.deleteCommunity(userId, communityId)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("returns user community count", async () => {
    mockUserRepo.getUserById.mockResolvedValue({ _id: userId });
    mockCommunityRepo.countByMember.mockResolvedValue(3);
    mockCommunityRepo.countByCreator.mockResolvedValue(2);

    const result = await service.getUserCommunityCount(userId);

    expect(result.joinedCount).toBe(3);
    expect(result.createdCount).toBe(2);
    expect(result.total).toBe(3);
  });
});
