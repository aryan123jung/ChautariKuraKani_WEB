"use server";

import { revalidatePath } from "next/cache";
import {
  type AdminUserStatusAction,
  updateAdminUserStatus,
} from "@/lib/api/admin/user";
import { handleDeleteAdminPost } from "@/lib/actions/admin/post-action";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleUpdateModerationUserStatus = async (
  userId: string,
  payload: { action: AdminUserStatusAction; suspensionDays?: number }
) => {
  try {
    const response = await updateAdminUserStatus(userId, payload);
    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to update user status",
      };
    }
    revalidatePath("/admin/reports");
    revalidatePath("/admin/users");
    return {
      success: true,
      message: response.message || "User status updated",
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Update user status action failed"),
    };
  }
};

export const handleDeleteModerationPost = async (postId: string) => {
  return handleDeleteAdminPost(postId);
};
