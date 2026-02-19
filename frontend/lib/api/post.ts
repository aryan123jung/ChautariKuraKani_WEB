import axios from "@/lib/api/axios";
import { API } from "./endpoints";

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

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const createPost = async (postData: FormData) => {
  try {
    const response = await axios.post(API.Post.CREATE, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Create post failed"));
  }
};

export const getAllPosts = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(API.Post.ALL, {
      params: { page, size },
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch posts failed"));
  }
};

export const updatePost = async (postId: string, postData: FormData) => {
  try {
    const response = await axios.put(API.Post.UPDATE(postId), postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Update post failed"));
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await axios.delete(API.Post.DELETE(postId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Delete post failed"));
  }
};

export const likePost = async (postId: string) => {
  try {
    const response = await axios.post(API.Post.LIKE(postId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Like post failed"));
  }
};

export const createComment = async (postId: string, text: string) => {
  try {
    const response = await axios.post(API.Post.COMMENTS(postId), { text });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Create comment failed"));
  }
};

export const deleteComment = async (postId: string, commentId: string) => {
  try {
    const response = await axios.delete(API.Post.DELETE_COMMENT(postId, commentId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Delete comment failed"));
  }
};
