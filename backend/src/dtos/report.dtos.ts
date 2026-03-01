import z from "zod";
import {
  REPORT_ACTION_TYPES,
  REPORT_PRIORITY_TYPES,
  REPORT_REASON_TYPES,
  REPORT_STATUS_TYPES,
  REPORT_TARGET_TYPES
} from "../models/report.model";

export const CreateReportDto = z.object({
  reasonType: z.enum(REPORT_REASON_TYPES),
  reasonText: z.string().trim().max(1000).optional(),
  evidenceUrls: z.array(z.string().trim().min(1)).max(5).optional(),
  priority: z.enum(REPORT_PRIORITY_TYPES).optional()
});

export const AssignReportDto = z.object({
  assignedTo: z.string().trim().optional()
});

export const ResolveReportDto = z.object({
  status: z.enum(REPORT_STATUS_TYPES),
  actionTaken: z.enum(REPORT_ACTION_TYPES).optional(),
  resolutionNote: z.string().trim().max(1500).optional(),
  suspensionDays: z.number().int().positive().max(365).optional()
});

export const AdminReportQueryDto = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(REPORT_STATUS_TYPES).optional(),
  targetType: z.enum(REPORT_TARGET_TYPES).optional(),
  reasonType: z.enum(REPORT_REASON_TYPES).optional(),
  priority: z.enum(REPORT_PRIORITY_TYPES).optional(),
  assignedTo: z.string().optional()
});

export type CreateReportInput = z.infer<typeof CreateReportDto>;
export type ResolveReportInput = z.infer<typeof ResolveReportDto>;
export type AdminReportQueryInput = z.infer<typeof AdminReportQueryDto>;
