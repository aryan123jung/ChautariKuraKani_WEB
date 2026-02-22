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

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export type FriendRequestItem = {
  _id: string;
  fromUserId: string | FriendUser;
  toUserId: string | FriendUser;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
};

export type FriendStatusData = {
  status: "SELF" | "NONE" | "FRIEND" | "PENDING_OUTGOING" | "PENDING_INCOMING";
  requestId: string | null;
};

export const sendFriendRequest = async (toUserId: string) => {
  try {
    const response = await axios.post(API.Friends.SEND_REQUEST(toUserId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Send friend request failed"));
  }
};

export const cancelFriendRequest = async (toUserId: string) => {
  try {
    const response = await axios.delete(API.Friends.CANCEL_REQUEST(toUserId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Cancel friend request failed"));
  }
};

export const getIncomingFriendRequests = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(API.Friends.INCOMING_REQUESTS, {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch incoming requests failed"));
  }
};

export const getOutgoingFriendRequests = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(API.Friends.OUTGOING_REQUESTS, {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch outgoing requests failed"));
  }
};

export const acceptFriendRequest = async (requestId: string) => {
  try {
    const response = await axios.post(API.Friends.ACCEPT_REQUEST(requestId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Accept request failed"));
  }
};

export const rejectFriendRequest = async (requestId: string) => {
  try {
    const response = await axios.post(API.Friends.REJECT_REQUEST(requestId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Reject request failed"));
  }
};

export const unfriendUser = async (friendUserId: string) => {
  try {
    const response = await axios.delete(API.Friends.UNFRIEND(friendUserId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Unfriend failed"));
  }
};

export const getFriendStatus = async (userId: string) => {
  try {
    const response = await axios.get(API.Friends.STATUS(userId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch friend status failed"));
  }
};
