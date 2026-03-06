import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

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

export type ReportPriority = "low" | "medium" | "high" | "critical";

export type CreateReportPayload = {
  reasonType: ReportReasonType;
  priority: ReportPriority;
  reasonText?: string;
  evidenceUrls?: string[];
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

const postWithFallback = async (
  primaryUrl: string,
  fallbackUrl: string,
  payload: CreateReportPayload
) => {
  try {
    const response = await axios.post(primaryUrl, payload);
    return response.data;
  } catch (error: unknown) {
    const status =
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status;

    if (status === 404) {
      const fallbackResponse = await axios.post(fallbackUrl, payload);
      return fallbackResponse.data;
    }

    throw new Error(getErrorMessage(error, "Request failed"));
  }
};

export const reportPost = async (postId: string, payload: CreateReportPayload) => {
  try {
    return await postWithFallback(
      API.Post.REPORT(postId),
      API.Reports.REPORT_POST(postId),
      payload
    );
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Report post failed"));
  }
};

export const reportUser = async (userId: string, payload: CreateReportPayload) => {
  try {
    return await postWithFallback(
      API.Auth.REPORT_USER(userId),
      API.Reports.REPORT_USER(userId),
      payload
    );
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Report user failed"));
  }
};

export const reportChautari = async (communityId: string, payload: CreateReportPayload) => {
  try {
    return await postWithFallback(
      API.Chautari.REPORT(communityId),
      API.Reports.REPORT_CHAUTARI(communityId),
      payload
    );
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Report community failed"));
  }
};
