const mockUserRepo = {
  getUserById: jest.fn()
};

const mockPostRepo = {
  findById: jest.fn()
};

const mockCommunityRepo = {
  findById: jest.fn()
};

const mockReportModel = {
  find: jest.fn(),
  updateMany: jest.fn()
};

jest.mock("../../repositories/user.repository", () => ({
  UserRepository: jest.fn(() => mockUserRepo)
}));

jest.mock("../../repositories/post.repository", () => ({
  PostRepository: jest.fn(() => mockPostRepo)
}));

jest.mock("../../repositories/community.repository", () => ({
  CommunityRepository: jest.fn(() => mockCommunityRepo)
}));

jest.mock("../../models/report.model", () => ({
  REPORT_TARGET_TYPES: ["user", "post", "community"],
  REPORT_STATUS_TYPES: ["pending", "in_review", "resolved", "rejected", "escalated"],
  ReportModel: mockReportModel
}));

import { ReportService } from "../../services/report.services";

describe("ReportService (unit)", () => {
  const service = new ReportService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("auto-resolves pending orphan reports", async () => {
    const pendingReports = [
      { _id: { toString: () => "r1" }, targetType: "post", targetId: { toString: () => "p1" } },
      { _id: { toString: () => "r2" }, targetType: "community", targetId: { toString: () => "c1" } },
      { _id: { toString: () => "r3" }, targetType: "user", targetId: { toString: () => "u1" } }
    ];

    mockReportModel.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(pendingReports)
    });

    mockPostRepo.findById.mockResolvedValue(null);
    mockCommunityRepo.findById.mockResolvedValue({ _id: "c1" });
    mockUserRepo.getUserById.mockResolvedValue(null);
    mockReportModel.updateMany.mockResolvedValue({ modifiedCount: 2 });

    const result = await service.autoResolveOrphanedPendingReports();

    expect(result.checked).toBe(3);
    expect(result.resolved).toBe(2);
    expect(mockReportModel.updateMany).toHaveBeenCalled();
  });

  it("does not update when no orphan pending report exists", async () => {
    const pendingReports = [
      { _id: { toString: () => "r1" }, targetType: "post", targetId: { toString: () => "p1" } }
    ];

    mockReportModel.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(pendingReports)
    });

    mockPostRepo.findById.mockResolvedValue({ _id: "p1" });

    const result = await service.autoResolveOrphanedPendingReports();

    expect(result.checked).toBe(1);
    expect(result.resolved).toBe(0);
    expect(mockReportModel.updateMany).not.toHaveBeenCalled();
  });
});
