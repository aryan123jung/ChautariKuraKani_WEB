// import { NextFunction, Request, Response } from "express";
// import z, { success } from "zod";
// import { CreateUserDto,UpdateUserDto } from "../../dtos/user.dtos";
// import { AdminUserService } from "../../services/admin/user.services";

// let adminUserService = new AdminUserService();
// export class AdminUserController{

//     async createUser(req: Request, res: Response){
//         try{
//         const parsedData = CreateUserDto.safeParse(req.body);
//         if(!parsedData.success){
//             return res.status(400).json(
//                 {success: false, message : z.prettifyError(parsedData.error)}
//             )
//         }
//         const newUser = await adminUserService.createUser(parsedData.data);
//         return res.status(201).json(
//             {success: true, message: 'Register Successful', data: newUser}
//         )
//         }catch(error: Error | any){
//             return res.status(error.status || 500).json(
//                 {success: false, message: error.message || "Internal Server Error"}
//             )
//         }
//     }

//     async getUserById(req: Request, res: Response){
//         try{
//             const userId =  req.params.id; 
//             const user = await adminUserService.getUserById(userId);
//             return res.status(200).json(
//                 {success: true, data: user, message: "User fetched"}
//             )
//         } catch(error:Error |any){
//             return res.status(error.statusCode || 500).json(
//                 {success: false,message: error.message || "Internal Server Error"}
//             )
//         }
//     }

//     async getAllUser(req:Request, res:Response){
//         try{
//             const users = await adminUserService.getAllUsers();
//             return res.status(200).json(
//                 {success: true,data: users, message: "All users Retrieved"}
//             );
//         }catch(error: Error | any){
//             return res.status(error.statusCode ?? 500).json(
//                 {success: false, message: error.message || "Internal Server Error"}
//             )
//         }
//     }

//     async updateUser(req: Request, res: Response){
//         try{
//             const userId = req.params.id;
//             const parsedData = UpdateUserDto.safeParse(req.body);
//             if(!parsedData.success){
//                 return res.status(400).json(
//                     {success: false, message:z.prettifyError(parsedData.error)}
//                 )
//             }

//             const updateData: UpdateUserDto ={...parsedData.data};
            
//             const files = req.files as | { [fieldname: string]: Express.Multer.File[]} | undefined;

//             if(files?.profileUrl?.[0]){
//                 updateData.profileUrl = files.profileUrl[0].filename;
//             }

//             if(files?.coverUrl?.[0]){
//                 updateData.coverUrl =files.coverUrl[0].filename;
//             }

//             const updatedUser = await adminUserService.updateOneUser(userId,updateData);

//             return res.status(200).json({
//                 success: true,
//                 message: "User updated successfully",
//                 data: updatedUser
//             });
//         }catch(error: Error | any){
//             return res.status(error.statusCode ?? 500).json(
//                 {success: false,message: error.message || "Internal Server Error"}
//             );
//         }
//     }

//     async deleteUser(req: Request, res: Response, next: NextFunction){
//         try{
//             const userId = req.params.id;
//             const deleted = await adminUserService.deleteOneUser(userId);
//             if(!deleted){
//                 return res.status(404).json(
//                     {success: false, message: "User not found"}
//                 );
//             }
//             return res.status(200).json(
//                 {success: true, message: "User Deleted"}
//             );
//         } catch (error: Error | any){
//             return res.status(error.statusCode ?? 500).json(
//                 {success: false, message: error.message || "Internal Server Error"}
//             )
//         }
//     }

// }
import { NextFunction, Request, Response } from "express";
import z, { success } from "zod";
import { CreateUserDto,UpdateUserDto } from "../../dtos/user.dtos";
import { AdminUserService } from "../../services/admin/user.services";

let adminUserService = new AdminUserService();
export class AdminUserController{

    async createUser(req: Request, res: Response) {
    try {
        // Validate request body
        const parsedData = CreateUserDto.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                success: false,
                message: z.prettifyError(parsedData.error),
            });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        // Store only filename in parsedData
        if (files?.profileUrl?.[0]) {
            parsedData.data.profileUrl = files.profileUrl[0].filename;
        }

        if (files?.coverUrl?.[0]) {
            parsedData.data.coverUrl = files.coverUrl[0].filename;
        }

        // Create the user
        const newUser = await adminUserService.createUser(parsedData.data);

        if (!newUser) {
            return res.status(500).json({ success: false, message: "Failed to create user" });
        }

        const userObj = newUser.toObject();

        const host = `${req.protocol}://${req.get("host")}`;
        // userObj.profileUrl = userObj.profileUrl ? `${host}/uploads/${userObj.profileUrl}` : null;
        userObj.profileUrl = userObj.profileUrl ? `${userObj.profileUrl}` : null;
        // userObj.coverUrl = userObj.coverUrl ? `${host}/uploads/${userObj.coverUrl}` : null;
        userObj.coverUrl = userObj.coverUrl ? `${userObj.coverUrl}` : null;

        return res.status(201).json({
            success: true,
            message: "Register Successful",
            data: userObj,
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}


    async getUserById(req: Request, res: Response){
        try{
            const userId =  req.params.id; 
            const user = await adminUserService.getUserById(userId);
            return res.status(200).json(
                {success: true, data: user, message: "User fetched"}
            )
        } catch(error:Error |any){
            return res.status(error.statusCode || 500).json(
                {success: false,message: error.message || "Internal Server Error"}
            )
        }
    }

    async getAllUser(req:Request, res:Response){
        try{
            const users = await adminUserService.getAllUsers();
            return res.status(200).json(
                {success: true,data: users, message: "All users Retrieved"}
            );
        }catch(error: Error | any){
            return res.status(error.statusCode ?? 500).json(
                {success: false, message: error.message || "Internal Server Error"}
            )
        }
    }

    async updateUser(req: Request, res: Response){
        try{
            const userId = req.params.id;
            const parsedData = UpdateUserDto.safeParse(req.body);
            if(!parsedData.success){
                return res.status(400).json(
                    {success: false, message:z.prettifyError(parsedData.error)}
                )
            }

            const updateData: UpdateUserDto ={...parsedData.data};
            
            const files = req.files as | { [fieldname: string]: Express.Multer.File[]} | undefined;

            if(files?.profileUrl?.[0]){
                updateData.profileUrl = files.profileUrl[0].filename;
            }

            if(files?.coverUrl?.[0]){
                updateData.coverUrl =files.coverUrl[0].filename;
            }

            const updatedUser = await adminUserService.updateOneUser(userId,updateData);

            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: updatedUser
            });
        }catch(error: Error | any){
            return res.status(error.statusCode ?? 500).json(
                {success: false,message: error.message || "Internal Server Error"}
            );
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.id;
            const deleted = await adminUserService.deleteOneUser(userId);
            if(!deleted){
                return res.status(404).json(
                    {success: false, message: "User not found"}
                );
            }
            return res.status(200).json(
                {success: true, message: "User Deleted"}
            );
        } catch (error: Error | any){
            return res.status(error.statusCode ?? 500).json(
                {success: false, message: error.message || "Internal Server Error"}
            )
        }
    }

}