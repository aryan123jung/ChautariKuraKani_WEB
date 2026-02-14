
import axios from "../axios";
import { API } from "../endpoints";

// export interface CreateUserPayload {
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

export const fetchUsers = async () => {
  const response = await axios.get(API.ADMIN.USER.ALL);
  return response.data.data;
};

export const fetchOneUser = async (id: string) => {
  try {
    const response = await axios.get(
      API.ADMIN.USER.GET_ONE_User(id)
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Fetch user failed"
    );
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
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Create user failed"
    );
  }
};

export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(
            API.ADMIN.USER.DELETE(id)
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Delete user failed');
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
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Update user failed"
    );
  }
};
