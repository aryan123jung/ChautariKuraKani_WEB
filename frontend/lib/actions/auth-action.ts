'use server'

import {register} from '../api/auth';

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