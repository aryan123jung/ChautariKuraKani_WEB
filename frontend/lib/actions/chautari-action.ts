"use server";

import { revalidatePath } from "next/cache";
import {
  createChautari,
  createChautariPost,
  deleteChautari,
  getChautariById,
  getChautariMemberCount,
  getChautariPosts,
  joinChautari,
  leaveChautari,
  searchChautari,
} from "../api/chautari";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleCreateChautari = async (formData: FormData) => {
  try {
    const response = await createChautari(formData);
    revalidatePath("/user/chautari");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Community created successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Create community action failed"),
    };
  }
};

export const handleSearchChautari = async (search: string, page = 1, size = 20) => {
  try {
    const response = await searchChautari(search, page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Chautari search results",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "Search community action failed"),
    };
  }
};

export const handleGetChautariById = async (communityId: string) => {
  try {
    const response = await getChautariById(communityId);
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Community fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Get community action failed"),
    };
  }
};

export const handleDeleteChautari = async (communityId: string) => {
  try {
    const response = await deleteChautari(communityId);
    revalidatePath("/user/chautari");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Community deleted successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Delete community action failed"),
    };
  }
};

export const handleJoinChautari = async (communityId: string) => {
  try {
    const response = await joinChautari(communityId);
    revalidatePath("/user/chautari");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Joined successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Join community action failed"),
    };
  }
};

export const handleLeaveChautari = async (communityId: string) => {
  try {
    const response = await leaveChautari(communityId);
    revalidatePath("/user/chautari");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Left successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Leave community action failed"),
    };
  }
};

export const handleGetChautariMemberCount = async (communityId: string) => {
  try {
    const response = await getChautariMemberCount(communityId);
    return {
      success: !!response?.success,
      data: { count: Number(response?.data?.count || 0) },
      message: response?.message || "Member count fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: { count: 0 },
      message: getErrorMessage(error, "Get member count action failed"),
    };
  }
};

export const handleCreateChautariPost = async (communityId: string, formData: FormData) => {
  try {
    const response = await createChautariPost(communityId, formData);
    revalidatePath("/user/chautari");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Post created successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Create community post action failed"),
    };
  }
};

export const handleGetChautariPosts = async (communityId: string, page = 1, size = 20) => {
  try {
    const response = await getChautariPosts(communityId, page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Community posts fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "Get community posts action failed"),
    };
  }
};
