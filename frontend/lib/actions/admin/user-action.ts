// import { createUser, fetchUsers } from "@/lib/api/admin/user";
// import type { CreateUserPayload } from "@/lib/api/admin/user";

// export const handleCreateUser = async (data: CreateUserPayload) => {
//   try {
//     const response = await createUser(data);

//     if (!response.success) {
//       return {
//         success: false,
//         message: response.message,
//       };
//     }

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Create user failed",
//     };
//   }
// };

// export const getUsers = async () => {
//   try {
//     return await fetchUsers();
//   } catch {
//     return [];
//   }
// };


"use server";

import { createUser, deleteUser, fetchUsers } from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";

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

export const getUsers = async () => {
  try {
    return await fetchUsers();
  } catch {
    return [];
  }
};


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