'use server'

import { revalidatePath } from 'next/cache';
import {login, register, updateProfile, whoAmI, requestPasswordReset,resetPassword, searchUsers, getUserById} from '../api/auth';
import { setAuthToken, setUserData } from '../cookie';
import { LoginData, RegisterData } from '@/app/(auth)/schema';

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;
    return fallback;
};

export const handleRegister = async (data: RegisterData) => {
    try {
        const response = await register(data)
        if (response.success) {
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: unknown) {
        return { success: false, message: getErrorMessage(error, 'Registration action failed') }
    }
}

export const handleLogin = async (data: LoginData) => {
    try {
        const response = await login(data)
        if (response.success) {
            await setAuthToken(response.token)
            await setUserData(response.data)
            return {
                success: true,
                message: 'Login successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Login failed'
        }
    } catch (error: unknown) {
        return { success: false, message: getErrorMessage(error, 'Login action failed') }
    }
}

export async function handleWhoAmI() {
    try {
        const result = await whoAmI();
        if (result.success) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to fetch user data' };
    } catch (error: unknown) {
        return { success: false, message: getErrorMessage(error, "Whoami action failed") };
    }
}

export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success) {
            await setUserData(result.data); // update cookie 
            revalidatePath('/user/profile'); // revalidate profile page/ refresh new data
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: unknown) {
        return { success: false, message: getErrorMessage(error, "Update profile action failed") };
    }
}


export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: 'Password reset email sent successfully'
            }
        }
        return { success: false, message: response.message || 'Request password reset failed' }
    } catch (error: unknown) {
        return { success: false, message: getErrorMessage(error, 'Request password reset action failed') }
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: unknown) {
        return { success: false, message: getErrorMessage(error, 'Reset password action failed') }
    }
};

export const handleSearchUsers = async (search: string, page = 1, size = 8) => {
    try {
        const trimmedSearch = search.trim();
        if (!trimmedSearch || trimmedSearch.length < 2) {
            return {
                success: true,
                data: [],
                pagination: null,
                message: "Type at least 2 characters",
            };
        }

        const response = await searchUsers(trimmedSearch, page, size);
        if (response.success) {
            return {
                success: true,
                data: response.data || [],
                pagination: response.pagination || null,
                message: response.message || "Users fetched successfully",
            };
        }

        return {
            success: false,
            data: [],
            pagination: null,
            message: response.message || "Failed to search users",
        };
    } catch (error: unknown) {
        return {
            success: false,
            data: [],
            pagination: null,
            message: error instanceof Error ? error.message : "Search user action failed",
        };
    }
};

export const handleGetUserById = async (userId: string) => {
    try {
        const response = await getUserById(userId);
        if (response.success && response.data) {
            return {
                success: true,
                data: response.data,
                message: response.message || "User fetched successfully",
            };
        }

        return {
            success: false,
            data: null,
            message: response.message || "Failed to fetch user",
        };
    } catch (error: unknown) {
        return {
            success: false,
            data: null,
            message: getErrorMessage(error, "Get user action failed"),
        };
    }
};

export const handleFindUserById = async (userId: string) => {
    try {
        const pageSize = 50;
        const firstPage = await searchUsers(undefined, 1, pageSize);

        if (!firstPage.success) {
            return {
                success: false,
                data: null,
                message: firstPage.message || "Failed to fetch users",
            };
        }

        const firstMatch = (firstPage.data || []).find((user) => user._id === userId);
        if (firstMatch) {
            return {
                success: true,
                data: firstMatch,
                message: "User fetched successfully",
            };
        }

        const totalPages = firstPage.pagination?.totalPages || 1;

        for (let page = 2; page <= totalPages; page += 1) {
            const pageResult = await searchUsers(undefined, page, pageSize);
            if (!pageResult.success) {
                break;
            }

            const matched = (pageResult.data || []).find((user) => user._id === userId);
            if (matched) {
                return {
                    success: true,
                    data: matched,
                    message: "User fetched successfully",
                };
            }
        }

        return {
            success: false,
            data: null,
            message: "User not found",
        };
    } catch (error: unknown) {
        return {
            success: false,
            data: null,
            message: getErrorMessage(error, "Find user action failed"),
        };
    }
};
