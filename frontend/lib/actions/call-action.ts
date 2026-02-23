"use server";

import { listMyCalls } from "../api/call";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const handleListMyCalls = async (page = 1, size = 100) => {
  try {
    const response = await listMyCalls(page, size);
    return {
      success: !!response?.success,
      data: response?.data || [],
      pagination: response?.pagination || null,
      message: response?.message || "Call history fetched successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      pagination: null,
      message: getErrorMessage(error, "List calls action failed"),
    };
  }
};
