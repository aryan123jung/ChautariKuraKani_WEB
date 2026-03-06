"use server";

import { revalidatePath } from "next/cache";
import { deleteAdminPost, getAdminPosts } from "@/lib/api/admin/post";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleGetAdminPosts = async (page = 1, size = 10) => {
  try {
    const response = await getAdminPosts(page, size);
    if (!response.success) {
      return { success: false, message: response.message || "Failed to fetch admin posts" };
    }
    return {
      success: true,
      data: response.data || [],
      pagination: response.pagination || null,
      message: response.message || "Admin posts fetched",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "Fetch admin posts action failed"),
    };
  }
};

export const handleDeleteAdminPost = async (postId: string) => {
  try {
    const response = await deleteAdminPost(postId);
    if (!response.success) {
      return { success: false, message: response.message || "Failed to delete post" };
    }
    revalidatePath("/admin/posts");
    revalidatePath("/admin/reports");
    return { success: true, message: response.message || "Post deleted" };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Delete admin post action failed"),
    };
  }
};
