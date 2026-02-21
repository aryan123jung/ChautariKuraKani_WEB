"use server";

import { createUser, deleteUser, getAllUsers, updateUser, getUserById} from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";
import { getUserData, setUserData } from "@/lib/cookie";

export const handleCreateUser = async (formData: FormData) => {
  try {
    const response = await createUser(formData);

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Create user failed",
    };
  }
};


export const handleGetAllUsers = async (
    page: string, size: string, search?: string
) => {
    try {
        const currentPage = parseInt(page) || 1;
        const currentSize = parseInt(size) || 10;

        const response = await getAllUsers(currentPage, currentSize, search);
        if (response.success) {
            return {
                success: true,
                message: 'Get all users successful',
                data: response.data,
                pagination: response.pagination
            }
        }
        return {
            success: false,
            message: response.message || 'Get all users failed'
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Get all users action failed'
        }
    }
}


export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUser(id)
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Delete user successful'
            }
        }
        return {
            success: false,
            message: response.message || 'Delete user failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Delete user action failed' }
    }
  }


export const handleUpdateUser = async (id: string, formData: FormData) => {
  try {
    const response = await updateUser(id, formData);

    if (response.success) {
      const updatedUser = response.data;
      
      // Get the currently logged-in user
      const currentUser = await getUserData();
      
      // Only update cookie if this is the current user updating their own profile
      if (currentUser && currentUser._id === id) {
        await setUserData(updatedUser);
      }

      revalidatePath("/admin/users");
      revalidatePath(`/admin/users/${id}`);

      return {
        success: true,
        message: "Update user successful",
        data: updatedUser,
      };
    }

    return { success: false, message: response.message || "Update user failed" };
  } catch (error: any) {
    return { success: false, message: error.message || "Update user action failed" };
  }
};



export const handleGetOneUser = async (id: string) => {
  try {
    const response = await getUserById(id);

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Fetch user failed",
    };
  }
};
