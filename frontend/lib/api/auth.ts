// import axios, { axiosInstance } from "@/lib/api/axios";
// import { API } from "./endpoints";

// export const register = async (registrationData: any) => {
//     try{
//         const response = await axiosInstance.post(API.Auth.REGISTER, registrationData)
//         return response.data;
//     } catch(err: Error | any){
//         throw new Error(
//             err.response?.data?.message 
//             || err.message
//             || 'Registration failed'
//         )
//     }
// }

// export const login = async (loginData: any) => {
//     try{
//         const response = await axiosInstance.post(API.Auth.LOGIN, loginData)
//         return response.data; 
//     }catch(err: Error | any){
//         throw new Error(
//             err.response?.data?.message 
//             || err.message  
//             || 'Login failed' 
//         )
//     }
// }

// export const whoAmI = async () => {
//     try{
//         const response = await axios.get(API.Auth.WHOAMI);
//     return response.data;
//   } catch (error: Error | any) {
//     throw new Error(error.response?.data?.message
//       || error.message || 'Whoami failed');
//   }
// }

// export const updateProfile = async (profileData: any) => {
//   try {
//     const response = await axios.put(
//       API.Auth.UPDATEPROFILE,
//       profileData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data', // for file upload/multer
//         }
//       }
//     );
//     return response.data;
//   } catch (error: Error | any) {
//     throw new Error(error.response?.data?.message
//       || error.message || 'Update profile failed');
//   }
// }





import axios, { axiosInstance } from "@/lib/api/axios";
import { API } from "./endpoints";
import { LoginData, RegisterData } from "@/app/(auth)/schema";

type SearchUsersResponse = {
    success: boolean;
    data: Array<{
        _id: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        email?: string;
        profileUrl?: string;
        coverUrl?: string;
        role?: string;
        createdAt?: string;
        updatedAt?: string;
    }>;
    pagination?: {
        page: number;
        size: number;
        totalUsers: number;
        totalPages: number;
    };
    message?: string;
};

type GetUserResponse = {
    success: boolean;
    data?: {
        _id?: string;
        id?: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        email?: string;
        profileUrl?: string;
        coverUrl?: string;
        role?: string;
        createdAt?: string;
        updatedAt?: string;
    };
    message?: string;
};

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

export const register = async (registerData: RegisterData) => {
    try {
        const response = await axios.post(API.Auth.REGISTER, registerData)
        return response.data
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Registration failed"))
    }
}

export const login = async (loginData: LoginData) => {
    try {
        const response = await axios.post(API.Auth.LOGIN, loginData)
        return response.data
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Login failed"))
    }
}

export const whoAmI = async () => {
    try{
        const response = await axios.get(API.Auth.WHOAMI);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Whoami failed"));
  }
}

export const updateProfile = async (profileData: FormData) => {
  try {
    const response = await axios.put(
      API.Auth.UPDATEPROFILE,
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // for file upload/multer
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Update profile failed"));
  }
}


export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(API.Auth.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Request password reset failed"));
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.Auth.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Reset password failed"));
    }
}

export const searchUsers = async (search?: string, page = 1, size = 8): Promise<SearchUsersResponse> => {
    try {
        const params: { page: number; size: number; search?: string } = { page, size };
        if (search && search.trim()) {
            params.search = search;
        }

        const response = await axiosInstance.get(API.Auth.SEARCH_USERS, {
            params,
        });
        return response.data as SearchUsersResponse;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Search users failed"));
    }
};

export const getUserById = async (userId: string): Promise<GetUserResponse> => {
    try {
        const response = await axiosInstance.get(API.Auth.GET_USER_BY_ID(userId));
        return response.data as GetUserResponse;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Get user failed"));
    }
};
