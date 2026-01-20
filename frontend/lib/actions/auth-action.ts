'use server'

import {login, register} from '../api/auth';

export async function handleRegister(formData: any){
    try{
        const result = await register(formData)
        if(result.success){
            return{
                success: true,
                message: "Registration Successful",
                data: result.data
            }
        }
        return {success: false, message: result.message || "Registration Failed"}
    }catch(err: Error | any){
        return {success: false, message: err.message}        
    }
}

export async function handleLogin( formData: any){
    try{
        const result = await login(formData)
        if(result.success){
            return{
                success: true,
                message: "Login Successful",
                data: result.data
            }
        }
        return { success: false, message: result.message || "Login Failed"}
    } catch(err: Error | any){
        return {success: false, message: err.message}
    }
}