import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

export type ReportStatus =
  | "pending"
  | "in_review"
  | "resolved"
  | "rejected"
  | "escalated";

export type ReportPriority = "low" | "medium" | "high" | "critical";
export type ReportReasonType =
  | "spam"
  | "harassment"
  | "hate"
  | "violence"
  | "nudity"
  | "scam"
  | "misinformation"
  | "impersonation"
  | "other";

export type ActionTaken =
  | "none"
  | "suspend"
  | "ban"
  | "delete";

export type SanctionType =
  | "warning"
  | "mute"
  | "suspension"
  | "ban"
  | "content_restriction";

export type ResolveReportPayload = {
  status: ReportStatus;
  actionTaken: ActionTaken;
  resolutionNote?: string;
  sanctionType?: SanctionType;
  sanctionReason?: string;
  suspensionDays?: number;
};

export type ReportsQuery = {
  page?: number;
  size?: number;
  status?: ReportStatus;
  targetType?: "user" | "post" | "comment" | "message" | "community";
  reasonType?: ReportReasonType;
  priority?: ReportPriority;
  assignedTo?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message
  ) {
    return (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message as string;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

export const getAdminReportStats = async () => {
  try {
    const response = await axios.get(API.ADMIN.REPORTS.STATS);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get report stats failed"));
  }
};

export const getAdminReports = async (query: ReportsQuery) => {
  try {
    const response = await axios.get(API.ADMIN.REPORTS.ALL, {
      params: query,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get reports failed"));
  }
};

export const getAdminReportById = async (reportId: string) => {
  try {
    const response = await axios.get(API.ADMIN.REPORTS.GET_ONE(reportId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get report failed"));
  }
};

export const assignAdminReport = async (reportId: string, assignedTo: string) => {
  try {
    const response = await axios.patch(API.ADMIN.REPORTS.ASSIGN(reportId), {
      assignedTo,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Assign report failed"));
  }
};

export const resolveAdminReport = async (
  reportId: string,
  payload: ResolveReportPayload
) => {
  try {
    const response = await axios.patch(API.ADMIN.REPORTS.RESOLVE(reportId), payload);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Resolve report failed"));
  }
};
