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

export const listMyCalls = async (page = 1, size = 100) => {
  try {
    const response = await axios.get(API.Calls.ALL, {
      params: { page, size },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "List calls failed"));
  }
};
