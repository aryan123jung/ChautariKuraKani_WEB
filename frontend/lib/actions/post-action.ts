"use server";

import { revalidatePath } from "next/cache";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  likePost,
  updatePost,
} from "../api/post";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const handleCreatePost = async (postData: FormData) => {
  try {
    const response = await createPost(postData);

    if (response.success) {
      revalidatePath("/user/profile");
      revalidatePath("/user/home");

      return {
        success: true,
        message: response.message || "Post created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to create post",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Create post action failed"),
    };
  }
};

export const handleGetAllPosts = async (page = 1, size = 10) => {
  try {
    const response = await getAllPosts(page, size);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Posts fetched successfully",
        data: response.data,
        pagination: response.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch posts",
      data: [],
      pagination: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Fetch posts action failed"),
      data: [],
      pagination: null,
    };
  }
};

export const handleUpdatePost = async (postId: string, postData: FormData) => {
  try {
    const response = await updatePost(postId, postData);

    if (response.success) {
      revalidatePath("/user/profile");
      revalidatePath("/user/home");

      return {
        success: true,
        message: response.message || "Post updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to update post",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Update post action failed"),
      data: null,
    };
  }
};

export const handleDeletePost = async (postId: string) => {
  try {
    const response = await deletePost(postId);

    if (response.success) {
      revalidatePath("/user/profile");
      revalidatePath("/user/home");

      return {
        success: true,
        message: response.message || "Post deleted successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to delete post",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Delete post action failed"),
      data: null,
    };
  }
};

export const handleLikePost = async (postId: string) => {
  try {
    const response = await likePost(postId);

    if (response.success) {
      revalidatePath("/user/profile");
      revalidatePath("/user/home");

      return {
        success: true,
        message: response.message || "Post liked successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to like post",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Like post action failed"),
      data: null,
    };
  }
};

export const handleCreateComment = async (postId: string, text: string) => {
  try {
    const response = await createComment(postId, text);

    if (response.success) {
      revalidatePath("/user/profile");
      revalidatePath("/user/home");

      return {
        success: true,
        message: response.message || "Comment added successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to add comment",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Create comment action failed"),
      data: null,
    };
  }
};

export const handleDeleteComment = async (postId: string, commentId: string) => {
  try {
    const response = await deleteComment(postId, commentId);

    if (response.success) {
      revalidatePath("/user/profile");
      revalidatePath("/user/home");

      return {
        success: true,
        message: response.message || "Comment deleted successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to delete comment",
      data: null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Delete comment action failed"),
      data: null,
    };
  }
};
