import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

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

export const getAdminPosts = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(API.ADMIN.POSTS.ALL, {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get admin posts failed"));
  }
};

export const deleteAdminPost = async (postId: string) => {
  try {
    const response = await axios.delete(API.ADMIN.POSTS.DELETE(postId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Delete admin post failed"));
  }
};
