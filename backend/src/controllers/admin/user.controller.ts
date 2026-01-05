import { Request, Response } from "express";
import z, { success } from "zod";
import { CreateUserDto,UpdateUserDto } from "../../dtos/user.dtos";
import { AdminUserService } from "../../services/admin/user.services";

let adminUserService = new AdminUserService();
export class AdminUserController{
    async createUser(req: Request, res: Response){
        try{
        const parsedData = CreateUserDto.safeParse(req.body);
        if(!parsedData.success){
            return res.status(400).json(
                {success: false, message : z.prettifyError(parsedData.error)}
            )
        }
        const newUser = await adminUserService.createUser(parsedData.data);
        return res.status(201).json(
            {success: true, message: 'Register Successful', data: newUser}
        )
    }catch(error: Error | any){
        return res.status(error.status || 500).json(
            {success: false, message: error.message || "Internal Server Error"}
        )
    }
    }
    async getOneUser(req: Request, res: Response){
        try{
            const userId =  req.params.id; 
            const user = await adminUserService.getOneUser(userId);
            return res.status(200).json(
                {success: true, data: user, message: "User fetched"}
            )
        } catch(error:Error |any){
            return res.status(error.statusCode || 500).json(
                {success: false,message: error.message || "Internal Server Error"}
            )
        }
    }
}