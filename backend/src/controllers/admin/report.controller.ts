import { Request, Response } from "express";
import z from "zod";
import {
  AdminReportQueryDto,
  AssignReportDto,
  ResolveReportDto
} from "../../dtos/report.dtos";
import { AdminReportService } from "../../services/admin/report.services";

const adminReportService = new AdminReportService();

export class AdminReportController {
  async listReports(req: Request, res: Response) {
    try {
      const parsed = AdminReportQueryDto.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const { reports, pagination } = await adminReportService.listReports(parsed.data);
      return res.status(200).json({
        success: true,
        data: reports,
        pagination,
        message: "Reports fetched successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async getReportStats(req: Request, res: Response) {
    try {
      const stats = await adminReportService.getReportStats();
      return res.status(200).json({
        success: true,
        data: stats,
        message: "Report stats fetched successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async getReportById(req: Request, res: Response) {
    try {
      const report = await adminReportService.getReportById(req.params.id);
      return res.status(200).json({
        success: true,
        data: report,
        message: "Report fetched successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async assignReport(req: Request, res: Response) {
    try {
      const adminId = req.user?._id?.toString();
      if (!adminId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const parsed = AssignReportDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const report = await adminReportService.assignReport(
        req.params.id,
        adminId,
        parsed.data.assignedTo || adminId,
        {
          ipAddress: req.ip,
          userAgent: req.get("user-agent") || undefined
        }
      );

      return res.status(200).json({
        success: true,
        data: report,
        message: "Report assigned successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async resolveReport(req: Request, res: Response) {
    try {
      const adminId = req.user?._id?.toString();
      if (!adminId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const parsed = ResolveReportDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error)
        });
      }

      const report = await adminReportService.resolveReport(
        req.params.id,
        adminId,
        parsed.data,
        {
          ipAddress: req.ip,
          userAgent: req.get("user-agent") || undefined
        }
      );

      return res.status(200).json({
        success: true,
        data: report,
        message: "Report updated successfully"
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }
}
