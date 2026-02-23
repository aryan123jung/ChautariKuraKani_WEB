"use server";

import { revalidatePath } from "next/cache";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendCount,
  getFriendStatus,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  rejectFriendRequest,
  sendFriendRequest,
  unfriendUser,
} from "../api/friend";
import { searchUsers } from "../api/auth";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleSendFriendRequest = async (toUserId: string) => {
  try {
    const response = await sendFriendRequest(toUserId);
    revalidatePath("/user/friends");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Friend request sent successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Send friend request action failed"),
    };
  }
};

export const handleCancelFriendRequest = async (toUserId: string) => {
  try {
    const response = await cancelFriendRequest(toUserId);
    revalidatePath("/user/friends");
    return {
      success: !!response?.success,
      message: response?.message || "Friend request cancelled successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Cancel friend request action failed"),
    };
  }
};

export const handleGetIncomingFriendRequests = async (page = 1, size = 10) => {
  try {
    const response = await getIncomingFriendRequests(page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Incoming requests fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "Get incoming requests action failed"),
    };
  }
};

export const handleGetOutgoingFriendRequests = async (page = 1, size = 10) => {
  try {
    const response = await getOutgoingFriendRequests(page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Outgoing requests fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "Get outgoing requests action failed"),
    };
  }
};

export const handleAcceptFriendRequest = async (requestId: string) => {
  try {
    const response = await acceptFriendRequest(requestId);
    revalidatePath("/user/friends");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Friend request accepted",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Accept request action failed"),
    };
  }
};

export const handleRejectFriendRequest = async (requestId: string) => {
  try {
    const response = await rejectFriendRequest(requestId);
    revalidatePath("/user/friends");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Friend request rejected",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Reject request action failed"),
    };
  }
};

export const handleUnfriendUser = async (friendUserId: string) => {
  try {
    const response = await unfriendUser(friendUserId);
    revalidatePath("/user/friends");
    return {
      success: !!response?.success,
      message: response?.message || "Unfriended successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Unfriend action failed"),
    };
  }
};

export const handleGetFriendStatus = async (userId: string) => {
  try {
    const response = await getFriendStatus(userId);
    return {
      success: !!response?.success,
      data: response?.data || { status: "NONE", requestId: null },
      message: response?.message || "Friend status fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: { status: "NONE", requestId: null },
      message: getErrorMessage(error, "Get friend status action failed"),
    };
  }
};

export const handleGetFriendCount = async (userId: string) => {
  try {
    const response = await getFriendCount(userId);
    return {
      success: !!response?.success,
      data: { count: Number(response?.data?.count || 0) },
      message: response?.message || "Friend count fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: { count: 0 },
      message: getErrorMessage(error, "Get friend count action failed"),
    };
  }
};

export const handleGetMyFriends = async (page = 1, size = 100) => {
  try {
    const usersResponse = await searchUsers(undefined, page, size);
    if (!usersResponse.success) {
      return {
        success: false,
        data: [],
        message: usersResponse.message || "Failed to fetch users",
      };
    }

    const users = usersResponse.data || [];
    const statuses = await Promise.all(
      users.map(async (user) => {
        if (!user?._id) return null;
        const statusResponse = await getFriendStatus(user._id);
        if (!statusResponse?.success) return null;
        return {
          user,
          status: statusResponse.data?.status || "NONE",
        };
      })
    );

    const friends = statuses
      .filter((item) => item && item.status === "FRIEND")
      .map((item) => item!.user);

    return {
      success: true,
      data: friends,
      message: "Friends fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      message: getErrorMessage(error, "Get friends action failed"),
    };
  }
};
