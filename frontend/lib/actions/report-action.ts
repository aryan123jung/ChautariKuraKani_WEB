"use server";

import {
  reportChautari,
  reportPost,
  reportUser,
  type CreateReportPayload,
} from "@/lib/api/report";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleReportPost = async (postId: string, payload: CreateReportPayload) => {
  try {
    const response = await reportPost(postId, payload);
    if (response.success) {
      return {
        success: true,
        message: response.message || "Post reported successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Failed to report post",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Report post action failed"),
    };
  }
};

export const handleReportUser = async (userId: string, payload: CreateReportPayload) => {
  try {
    const response = await reportUser(userId, payload);
    if (response.success) {
      return {
        success: true,
        message: response.message || "User reported successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Failed to report user",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Report user action failed"),
    };
  }
};

export const handleReportChautari = async (
  communityId: string,
  payload: CreateReportPayload
) => {
  try {
    const response = await reportChautari(communityId, payload);
    if (response.success) {
      return {
        success: true,
        message: response.message || "Community reported successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Failed to report community",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Report community action failed"),
    };
  }
};
