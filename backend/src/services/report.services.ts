import { QueryFilter } from "mongoose";
import { HttpError } from "../errors/http-error";
import {
  IReport,
  REPORT_STATUS_TYPES,
  REPORT_TARGET_TYPES,
  ReportModel
} from "../models/report.model";
import { CommunityRepository } from "../repositories/community.repository";
import { PostRepository } from "../repositories/post.repository";
import { UserRepository } from "../repositories/user.repository";
import { CreateReportInput } from "../dtos/report.dtos";

const userRepo = new UserRepository();
const postRepo = new PostRepository();
const communityRepo = new CommunityRepository();

type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number];

export class ReportService {
  private async ensureTargetExists(targetType: ReportTargetType, targetId: string, reporterId: string) {
    if (targetType === "post") {
      const post = await postRepo.findById(targetId);
      if (!post) {
        throw new HttpError(404, "Post not found");
      }
      return;
    }

    if (targetType === "community") {
      const community = await communityRepo.findById(targetId);
      if (!community) {
        throw new HttpError(404, "Chautari not found");
      }
      return;
    }

    if (targetType === "user") {
      const user = await userRepo.getUserById(targetId);
      if (!user) {
        throw new HttpError(404, "User not found");
      }
      if (user._id.toString() === reporterId) {
        throw new HttpError(400, "You cannot report yourself");
      }
      return;
    }

    throw new HttpError(400, "Unsupported report target");
  }

  async createReport(
    reporterId: string,
    targetType: ReportTargetType,
    targetId: string,
    payload: CreateReportInput
  ) {
    await this.ensureTargetExists(targetType, targetId, reporterId);

    const existingOpenReport = await ReportModel.findOne({
      reporterId,
      targetType,
      targetId,
      status: { $in: ["pending", "in_review"] }
    });

    if (existingOpenReport) {
      throw new HttpError(409, "You already reported this item and it is under review");
    }

    const report = await ReportModel.create({
      reporterId,
      targetType,
      targetId,
      reasonType: payload.reasonType,
      reasonText: payload.reasonText || "",
      evidenceUrls: payload.evidenceUrls || [],
      priority: payload.priority || "medium"
    });

    return report;
  }

  async getMyReports(
    reporterId: string,
    { page, size }: { page?: string; size?: string }
  ) {
    const currentPage = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;

    const filter: QueryFilter<IReport> = {
      reporterId: reporterId as any
    };

    const [reports, total] = await Promise.all([
      ReportModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize),
      ReportModel.countDocuments(filter)
    ]);

    return {
      reports,
      pagination: {
        page: currentPage,
        size: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
}
