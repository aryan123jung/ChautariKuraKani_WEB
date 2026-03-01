import { AdminReportQueryInput, ResolveReportInput } from "../../dtos/report.dtos";
import { HttpError } from "../../errors/http-error";
import { AdminActionLogModel } from "../../models/admin-action-log.model";
import { ReportModel } from "../../models/report.model";
import { UserSanctionModel } from "../../models/user-sanction.model";
import { PostRepository } from "../../repositories/post.repository";
import { CommunityRepository } from "../../repositories/community.repository";
import { UserRepository } from "../../repositories/user.repository";

const postRepo = new PostRepository();
const communityRepo = new CommunityRepository();
const userRepo = new UserRepository();

export class AdminReportService {
  private async createAuditLog(data: {
    adminId: string;
    action: string;
    resourceType: "report" | "user" | "post" | "community" | "system";
    resourceId?: string;
    status: "success" | "failed";
    reason?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    await AdminActionLogModel.create({
      adminId: data.adminId,
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      status: data.status,
      reason: data.reason,
      metadata: data.metadata || {},
      ipAddress: data.ipAddress,
      userAgent: data.userAgent
    });
  }

  private getPagination(page?: string, size?: string) {
    const currentPage = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;
    return { currentPage, pageSize };
  }

  private async getUserIdForReportTarget(report: any): Promise<string | null> {
    if (report.targetType === "user") {
      return report.targetId.toString();
    }

    if (report.targetType === "post") {
      const post = await postRepo.findById(report.targetId.toString());
      if (!post) return null;
      const authorId: any = post.authorId;
      return typeof authorId === "string"
        ? authorId
        : authorId?._id?.toString?.() || authorId.toString();
    }

    if (report.targetType === "community") {
      const community = await communityRepo.findById(report.targetId.toString());
      if (!community) return null;
      const creatorId: any = community.creatorId;
      return typeof creatorId === "string"
        ? creatorId
        : creatorId?._id?.toString?.() || creatorId.toString();
    }

    return null;
  }

  private async getTargetData(report: any): Promise<any | null> {
    const targetId = report.targetId?.toString?.() || report.targetId;

    if (report.targetType === "user") {
      const user = await userRepo.getUserById(targetId);
      if (!user) return null;
      const { posts, total } = await postRepo.findAllByAuthor(targetId, 1, 20);
      return {
        user,
        posts,
        postsMeta: {
          total,
          page: 1,
          size: 20
        }
      };
    }

    if (report.targetType === "post") {
      return await postRepo.findById(targetId);
    }

    if (report.targetType === "community") {
      const community = await communityRepo.findById(targetId);
      if (!community) return null;
      const { posts, total } = await postRepo.findAllByCommunity(targetId, 1, 20);
      return {
        community,
        posts,
        postsMeta: {
          total,
          page: 1,
          size: 20
        }
      };
    }

    return null;
  }

  async listReports(query: AdminReportQueryInput) {
    const { currentPage, pageSize } = this.getPagination(query.page, query.size);

    const filter: Record<string, any> = {};
    if (query.status) filter.status = query.status;
    if (query.targetType) filter.targetType = query.targetType;
    if (query.reasonType) filter.reasonType = query.reasonType;
    if (query.priority) filter.priority = query.priority;
    if (query.assignedTo) filter.assignedTo = query.assignedTo;

    const [reports, total] = await Promise.all([
      ReportModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .populate("reporterId", "firstName lastName username email role")
        .populate("assignedTo", "firstName lastName username email role"),
      ReportModel.countDocuments(filter)
    ]);

    const reportsWithTarget = await Promise.all(
      reports.map(async (report: any) => {
        const reportObj = report.toObject();
        const targetData = await this.getTargetData(report);
        return {
          ...reportObj,
          targetData
        };
      })
    );

    return {
      reports: reportsWithTarget,
      pagination: {
        page: currentPage,
        size: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async getReportById(reportId: string) {
    const report = await ReportModel.findById(reportId)
      .populate("reporterId", "firstName lastName username email role")
      .populate("assignedTo", "firstName lastName username email role");

    if (!report) {
      throw new HttpError(404, "Report not found");
    }

    const targetData = await this.getTargetData(report);

    return {
      ...report.toObject(),
      targetData
    };
  }

  async getReportStats() {
    const [pending, inReview, resolved, rejected, escalated, total] = await Promise.all([
      ReportModel.countDocuments({ status: "pending" }),
      ReportModel.countDocuments({ status: "in_review" }),
      ReportModel.countDocuments({ status: "resolved" }),
      ReportModel.countDocuments({ status: "rejected" }),
      ReportModel.countDocuments({ status: "escalated" }),
      ReportModel.countDocuments({})
    ]);

    return {
      total,
      pending,
      inReview,
      resolved,
      rejected,
      escalated
    };
  }

  async assignReport(
    reportId: string,
    adminId: string,
    assignedTo: string,
    meta?: { ipAddress?: string; userAgent?: string }
  ) {
    const report = await ReportModel.findById(reportId);
    if (!report) {
      throw new HttpError(404, "Report not found");
    }

    const assignee = await userRepo.getUserById(assignedTo);
    if (!assignee || assignee.role !== "admin") {
      throw new HttpError(400, "Assignee must be an admin");
    }

    report.assignedTo = assignee._id as any;
    if (report.status === "pending") {
      report.status = "in_review" as any;
    }
    await report.save();

    await this.createAuditLog({
      adminId,
      action: "report.assign",
      resourceType: "report",
      resourceId: reportId,
      status: "success",
      metadata: { assignedTo },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent
    });

    return report;
  }

  async resolveReport(
    reportId: string,
    adminId: string,
    payload: ResolveReportInput,
    meta?: { ipAddress?: string; userAgent?: string }
  ) {
    const report = await ReportModel.findById(reportId);
    if (!report) {
      throw new HttpError(404, "Report not found");
    }

    const actionTaken = payload.actionTaken || "none";

    if (payload.status === "resolved") {
      if (
        report.targetType !== "user" &&
        ["suspend", "ban"].includes(actionTaken)
      ) {
        throw new HttpError(
          400,
          "For post/chautari reports, allowed actions are only none or delete"
        );
      }

      if (actionTaken === "delete") {
        if (report.targetType === "post") {
          const deleted = await postRepo.delete(report.targetId.toString());
          if (!deleted) throw new HttpError(404, "Post not found for moderation");
        } else if (report.targetType === "community") {
          await postRepo.deleteByCommunityId(report.targetId.toString());
          const deletedCommunity = await communityRepo.deleteById(report.targetId.toString());
          if (!deletedCommunity) throw new HttpError(404, "Chautari not found for moderation");
        } else {
          throw new HttpError(400, "delete action is supported for post/chautari reports only");
        }
      }

      if (["suspend", "ban"].includes(actionTaken)) {
        const targetUserId = await this.getUserIdForReportTarget(report);
        if (!targetUserId) {
          throw new HttpError(404, "Could not find target user for moderation action");
        }

        const targetUser = await userRepo.getUserById(targetUserId);
        if (!targetUser) {
          throw new HttpError(404, "Target user not found");
        }

        const userUpdate: any = {};
        if (actionTaken === "suspend") {
          userUpdate.accountStatus = "suspended";
          if (payload.suspensionDays) {
            const until = new Date();
            until.setDate(until.getDate() + payload.suspensionDays);
            userUpdate.suspensionUntil = until;
          }
        }
        if (actionTaken === "ban") {
          userUpdate.accountStatus = "banned";
          userUpdate.suspensionUntil = undefined;
        }

        if (Object.keys(userUpdate).length > 0) {
          await userRepo.updateUser(targetUserId, userUpdate);
        }

        await UserSanctionModel.create({
          userId: targetUserId,
          issuedBy: adminId,
          type: actionTaken === "ban" ? "ban" : "suspension",
          scope: "global",
          reason: payload.resolutionNote || `Sanction from report ${reportId}`,
          startsAt: new Date(),
          endsAt:
            actionTaken === "suspend" && payload.suspensionDays
              ? new Date(Date.now() + payload.suspensionDays * 24 * 60 * 60 * 1000)
              : undefined,
          status: "active",
          metadata: {
            reportId,
            reportTargetType: report.targetType,
            reportTargetId: report.targetId.toString(),
            actionTaken
          }
        });
      }
    }

    report.status = payload.status as any;
    report.actionTaken = actionTaken as any;
    report.resolutionNote = payload.resolutionNote || "";
    report.assignedTo = report.assignedTo || (adminId as any);

    if (payload.status === "resolved" || payload.status === "rejected") {
      report.resolvedAt = new Date();
    }

    await report.save();

    await this.createAuditLog({
      adminId,
      action: "report.resolve",
      resourceType: "report",
      resourceId: reportId,
      status: "success",
      metadata: {
        reportStatus: payload.status,
        actionTaken
      },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent
    });

    return report;
  }
}
