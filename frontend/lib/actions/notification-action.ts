"use server";

import { revalidatePath } from "next/cache";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notification";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleGetNotifications = async (page = 1, size = 20) => {
  try {
    const response = await getNotifications(page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Notifications fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "Get notifications action failed"),
    };
  }
};

export const handleMarkNotificationRead = async (notificationId: string) => {
  try {
    const response = await markNotificationRead(notificationId);
    revalidatePath("/user/home");
    return {
      success: !!response?.success,
      data: response?.data || null,
      message: response?.message || "Notification marked as read",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Mark notification read action failed"),
    };
  }
};

export const handleMarkAllNotificationsRead = async () => {
  try {
    const response = await markAllNotificationsRead();
    revalidatePath("/user/home");
    return {
      success: !!response?.success,
      message: response?.message || "All notifications marked as read",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Mark all notifications read action failed"),
    };
  }
};
