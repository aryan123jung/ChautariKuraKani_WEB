import { createUser, fetchUsers } from "@/lib/api/admin/user";

export const handleCreateUser = async (data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await createUser(data);

    if (!response.success) {
      return { success: false, message: response.message };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Create user failed",
    };
  }
};

export const getUsers = async () => {
  try {
    const users = await fetchUsers();
    return users;
  } catch (error: any) {
    return [];
  }
};