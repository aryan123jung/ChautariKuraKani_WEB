import axios from "../axios";
import { API } from "../endpoints";

export const fetchUsers = async () => {
  const response = await axios.get(API.ADMIN.USER.ALL);
  return response.data.data;
};

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(
      API.ADMIN.USER.CREATE,
      userData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Create user failed"
    );
  }
};
