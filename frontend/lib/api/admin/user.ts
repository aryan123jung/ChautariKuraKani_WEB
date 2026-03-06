
import axios from "../axios";
import { API } from "../endpoints";

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
  if (error instanceof Error) return error.message;
  return fallback;
};

// export interface CreateUserPayload {
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export const getAllUsers = async () => {
//   const response = await axios.get(API.ADMIN.USER.ALL);
//   return response.data.data;
// };
export const getAllUsers = async (
    page: number, size: number, search?: string
) => {
    try {
        const response = await axios.get(
            API.ADMIN.USER.ALL,
            {
                params: { page, size, search }
            }
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Get all users failed"));
    }
}

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(
      API.ADMIN.USER.GET_ONE_User(id)
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch user failed"));
  }
};

export type AdminUserStatusAction = "suspend" | "unsuspend" | "ban" | "unban" | "delete";
export type UpdateAdminUserStatusPayload = {
  action: AdminUserStatusAction;
  suspensionDays?: number;
};

export const getUserProfileById = async (
  id: string,
  page = 1,
  size = 10
) => {
  try {
    const response = await axios.get(API.ADMIN.USER.GET_PROFILE(id), {
      params: { page, size },
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Fetch user profile failed"));
  }
};

export const updateAdminUserStatus = async (
  id: string,
  payload: UpdateAdminUserStatusPayload
) => {
  try {
    const body: UpdateAdminUserStatusPayload = { action: payload.action };

    if (payload.action === "suspend") {
      const days = payload.suspensionDays ?? 7;
      if (!Number.isInteger(days) || days <= 0 || days > 365) {
        throw new Error("suspensionDays must be an integer between 1 and 365");
      }
      body.suspensionDays = days;
    }

    const response = await axios.patch(API.ADMIN.USER.UPDATE_STATUS(id), body);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Update user status failed"));
  }
};



export const createUser = async (formData: FormData) => {
  try {
    const response = await axios.post(API.ADMIN.USER.CREATE, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // optional; axios handles it automatically
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Create user failed"));
  }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(
            API.ADMIN.USER.DELETE(id)
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Delete user failed"));
    }
}



export const updateUser = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(
      API.ADMIN.USER.UPDATE(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Update user failed"));
  }
};
