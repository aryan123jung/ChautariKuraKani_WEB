"use server";

import { revalidatePath } from "next/cache";
import {
  getOrCreateConversation,
  listConversations,
  listMessages,
  markConversationRead,
  sendMessage,
} from "../api/message";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleGetOrCreateConversation = async (otherUserId: string) => {
  try {
    const response = await getOrCreateConversation(otherUserId);
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Conversation ready",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Get or create conversation action failed"),
    };
  }
};

export const handleListConversations = async (page = 1, size = 20) => {
  try {
    const response = await listConversations(page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Conversations fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "List conversations action failed"),
    };
  }
};

export const handleListMessages = async (conversationId: string, page = 1, size = 50) => {
  try {
    const response = await listMessages(conversationId, page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Messages fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "List messages action failed"),
    };
  }
};

export const handleSendMessage = async (conversationId: string, text: string) => {
  try {
    const response = await sendMessage(conversationId, text);
    revalidatePath("/user/message");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Message sent successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Send message action failed"),
    };
  }
};

export const handleMarkConversationRead = async (conversationId: string) => {
  try {
    const response = await markConversationRead(conversationId);
    return {
      success: !!response?.success,
      message: response?.message || "Conversation marked as read",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Mark conversation read action failed"),
    };
  }
};
