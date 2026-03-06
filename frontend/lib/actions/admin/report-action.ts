"use server";

import { revalidatePath } from "next/cache";
import {
  assignAdminReport,
  getAdminReportById,
  getAdminReports,
  getAdminReportStats,
  resolveAdminReport,
  type ReportsQuery,
  type ResolveReportPayload,
} from "@/lib/api/admin/report";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleGetAdminReportStats = async () => {
  try {
    const response = await getAdminReportStats();
    if (!response.success) {
      return { success: false, message: response.message || "Failed to get report stats" };
    }
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Get report stats action failed"),
      data: null,
    };
  }
};

export const handleGetAdminReports = async (query: ReportsQuery) => {
  try {
    const response = await getAdminReports(query);
    if (!response.success) {
      return { success: false, message: response.message || "Failed to get reports" };
    }
    return {
      success: true,
      data: response.data || [],
      pagination: response.pagination || null,
      message: response.message || "Reports loaded",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Get reports action failed"),
      data: [],
      pagination: null,
    };
  }
};

export const handleGetAdminReportById = async (reportId: string) => {
  try {
    const response = await getAdminReportById(reportId);
    if (!response.success) {
      return { success: false, message: response.message || "Failed to get report", data: null };
    }
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Get report action failed"),
      data: null,
    };
  }
};

export const handleAssignAdminReport = async (reportId: string, assignedTo: string) => {
  try {
    const response = await assignAdminReport(reportId, assignedTo);
    if (!response.success) {
      return { success: false, message: response.message || "Failed to assign report" };
    }
    revalidatePath("/admin/reports");
    return { success: true, message: response.message || "Report assigned", data: response.data };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Assign report action failed"),
    };
  }
};

export const handleResolveAdminReport = async (
  reportId: string,
  payload: ResolveReportPayload
) => {
  try {
    const response = await resolveAdminReport(reportId, payload);
    if (!response.success) {
      return { success: false, message: response.message || "Failed to resolve report" };
    }
    revalidatePath("/admin/reports");
    return { success: true, message: response.message || "Report resolved", data: response.data };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Resolve report action failed"),
    };
  }
};
