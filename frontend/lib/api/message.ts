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

export const getOrCreateConversation = async (otherUserId: string) => {
  try {
    const response = await axios.post(API.Messages.GET_OR_CREATE_CONVERSATION(otherUserId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Get or create conversation failed"));
  }
};

export const listConversations = async (page = 1, size = 20) => {
  try {
    const response = await axios.get(API.Messages.LIST_CONVERSATIONS, {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "List conversations failed"));
  }
};

export const listMessages = async (conversationId: string, page = 1, size = 50) => {
  try {
    const response = await axios.get(API.Messages.LIST_MESSAGES(conversationId), {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "List messages failed"));
  }
};

export const sendMessage = async (conversationId: string, text: string) => {
  try {
    const response = await axios.post(API.Messages.SEND_MESSAGE(conversationId), { text });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Send message failed"));
  }
};

export const markConversationRead = async (conversationId: string) => {
  try {
    const response = await axios.patch(API.Messages.MARK_READ(conversationId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Mark conversation read failed"));
  }
};
