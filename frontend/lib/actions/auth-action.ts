// 'use server'

// import { revalidatePath } from 'next/cache';
// import {login, register, updateProfile, whoAmI} from '../api/auth';
// import { setUserData } from '../cookie';

// export async function handleRegister(formData: any){
//     try{
//         const result = await register(formData)
//         if(result.success){
//             return{
//                 success: true,
//                 message: "Registration Successful",
//                 data: result.data
//             }
//         }
//         return {success: false, message: result.message || "Registration Failed"}
//     }catch(err: Error | any){
//         return {success: false, message: err.message}        
//     }
// }

// export async function handleLogin( formData: any){
//     try{
//         const result = await login(formData)
//         if(result.success){
//             return{
//                 success: true,
//                 message: "Login Successful",
//                 data: result.data
//             }
//         }
//         return { success: false, message: result.message || "Login Failed"}
//     } catch(err: Error | any){
//         return {success: false, message: err.message}
//     }
// }

// export async function handleWhoAmI() {
//     try {
//         const result = await whoAmI();
//         if (result.success) {
//             return {
//                 success: true,
//                 message: 'User data fetched successfully',
//                 data: result.data
//             };
//         }
//         return { success: false, message: result.message || 'Failed to fetch user data' };
//     } catch (error: Error | any) {
//         return { success: false, message: error.message };
//     }
// }

// export async function handleUpdateProfile(profileData: FormData) {
//     try {
//         const result = await updateProfile(profileData);
//         if (result.success) {
//             await setUserData(result.data); // update cookie 
//             revalidatePath('/user/profile'); // revalidate profile page/ refresh new data
//             return {
//                 success: true,
//                 message: 'Profile updated successfully',
//                 data: result.data
//             };
//         }
//         return { success: false, message: result.message || 'Failed to update profile' };
//     } catch (error: Error | any) {
//         return { success: false, message: error.message };
//     }
// }


'use server'

import { revalidatePath } from 'next/cache';
import {login, register, updateProfile, whoAmI} from '../api/auth';
import { setAuthToken, setUserData } from '../cookie';
import { LoginData, RegisterData } from '@/app/(auth)/schema';


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
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Registration action failed' }
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
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Login action failed' }
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
    } catch (error: Error | any) {
        return { success: false, message: error.message };
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
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}