import { Request, Response } from "express";
import z from "zod";
import { CreateReportDto } from "../dtos/report.dtos";
import { ReportService } from "../services/report.services";

const reportService = new ReportService();

interface QueryParams {
  page?: string;
  size?: string;
}

export class ReportController {
  async reportPost(req: Request, res: Response) {
    try {
      const reporterId = req.user?._id?.toString();
      if (!reporterId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const parsed = CreateReportDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const report = await reportService.createReport(
        reporterId,
        "post",
        req.params.postId,
        parsed.data
      );

      return res.status(201).json({
        success: true,
        data: report,
        message: "Post reported successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async reportUser(req: Request, res: Response) {
    try {
      const reporterId = req.user?._id?.toString();
      if (!reporterId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const parsed = CreateReportDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const report = await reportService.createReport(
        reporterId,
        "user",
        req.params.userId,
        parsed.data
      );

      return res.status(201).json({
        success: true,
        data: report,
        message: "User reported successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async reportChautari(req: Request, res: Response) {
    try {
      const reporterId = req.user?._id?.toString();
      if (!reporterId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const parsed = CreateReportDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const report = await reportService.createReport(
        reporterId,
        "community",
        req.params.communityId,
        parsed.data
      );

      return res.status(201).json({
        success: true,
        data: report,
        message: "Chautari reported successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async getMyReports(req: Request, res: Response) {
    try {
      const reporterId = req.user?._id?.toString();
      if (!reporterId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { page, size }: QueryParams = req.query;
      const { reports, pagination } = await reportService.getMyReports(reporterId, {
        page,
        size
      });

      return res.status(200).json({
        success: true,
        data: reports,
        pagination,
        message: "My reports fetched successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }
}
