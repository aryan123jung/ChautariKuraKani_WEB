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

export const getNotifications = async (page = 1, size = 20) => {
  try {
    const response = await axios.get(API.Notifications.ALL, {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch notifications failed"));
  }
};

export const markNotificationRead = async (notificationId: string) => {
  try {
    const response = await axios.patch(API.Notifications.MARK_READ(notificationId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Mark notification read failed"));
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const response = await axios.patch(API.Notifications.MARK_ALL_READ);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Mark all notifications read failed"));
  }
};
