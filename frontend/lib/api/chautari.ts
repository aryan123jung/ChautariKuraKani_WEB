import axios from "@/lib/api/axios";
import { API } from "./endpoints";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { data?: { message?: string } } }).response?.data?.message
  ) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message as string;
  }

  if (error instanceof Error) return error.message;
  return fallback;
};

export const createChautari = async (data: FormData) => {
  try {
    const response = await axios.post(API.Chautari.CREATE, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Create community failed"));
  }
};

export const searchChautari = async (search: string, page = 1, size = 20) => {
  try {
    const response = await axios.get(API.Chautari.SEARCH, {
      params: { search, page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Search community failed"));
  }
};

export const getChautariById = async (communityId: string) => {
  try {
    const response = await axios.get(API.Chautari.GET_ONE(communityId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get community failed"));
  }
};

export const deleteChautari = async (communityId: string) => {
  try {
    const response = await axios.delete(API.Chautari.DELETE(communityId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Delete community failed"));
  }
};

export const updateChautari = async (communityId: string, data: FormData) => {
  try {
    const response = await axios.put(API.Chautari.UPDATE(communityId), data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Update community failed"));
  }
};

export const joinChautari = async (communityId: string) => {
  try {
    const response = await axios.post(API.Chautari.JOIN(communityId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Join community failed"));
  }
};

export const leaveChautari = async (communityId: string) => {
  try {
    const response = await axios.post(API.Chautari.LEAVE(communityId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Leave community failed"));
  }
};

export const getChautariMemberCount = async (communityId: string) => {
  try {
    const response = await axios.get(API.Chautari.MEMBER_COUNT(communityId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get member count failed"));
  }
};

export const createChautariPost = async (communityId: string, data: FormData) => {
  try {
    const response = await axios.post(API.Chautari.CREATE_POST(communityId), data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Create community post failed"));
  }
};

export const getChautariPosts = async (communityId: string, page = 1, size = 20) => {
  try {
    const response = await axios.get(API.Chautari.GET_POSTS(communityId), {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get community posts failed"));
  }
};
