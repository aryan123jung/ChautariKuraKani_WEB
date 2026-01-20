import axios, { axiosInstance } from "@/lib/api/axios";
import { API } from "./endpoints";

export const register = async (registrationData: any) => {
    try{
        const response = await axiosInstance.post(API.Auth.REGISTER, registrationData)
        return response.data;
    } catch(err: Error | any){
        throw new Error(
            err.response?.data?.message 
            || err.message
            || 'Registration failed'
        )
    }
}

export const login = async (loginData: any) => {
    try{
        const response = await axiosInstance.post(API.Auth.LOGIN, loginData)
        return response.data; 
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message 
            || err.message  
            || 'Login failed' 
        )
    }
}