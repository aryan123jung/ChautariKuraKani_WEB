import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../configs';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { HttpError } from '../errors/http-error';
import { success } from 'zod';

declare global{
    namespace Express {
        interface Request {
            user?: Record<string, any> | IUser
        }
    }
} 
let userRepository = new UserRepository();

// export const authorizedMiddleware = 
//     async ( req: Request, res: Response, next: NextFunction) => {
//         try{
//             const authHeader = req.headers.authorization;
//             if(!authHeader || !authHeader.startsWith('Bearer '))
//                 throw new HttpError(401, 'Unauthorized JWT invalid');
//             const token = authHeader.split(' ')[1]; 
//             if(!token) throw new HttpError(401, 'Unauthorized JWT missing');
//             const decodedToken = jwt.verify(token, JWT_SECRET) as Record<string, any>;
//             if(!decodedToken || !decodedToken.id){
//                 throw new HttpError(401, 'Unauthorized JWT unverified');
//             } 
//             const user = await userRepository.getUserById(decodedToken.id);
//             if(!user) throw new HttpError(401, 'Unauthorized user not found');
//             req.user = user; 
//             next();
//         }catch(err: Error | any){
//             return res.status(err.statusCode || 500).json(
//                 { success: false, message: err.message }
//             )
//         }
// }
export const authorizedMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new HttpError(401, "Unauthorized JWT invalid");
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                throw new HttpError(401, "Unauthorized JWT missing");
            }

            let decodedToken: any;

            try {
                decodedToken = jwt.verify(token, JWT_SECRET);
            } catch (jwtError: any) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized JWT invalid"
                });
            }

            if (!decodedToken || !decodedToken.id) {
                throw new HttpError(401, "Unauthorized JWT unverified");
            }

            const user = await userRepository.getUserById(decodedToken.id);

            if (!user) {
                throw new HttpError(401, "Unauthorized user not found");
            }

            req.user = user;

            next();

        } catch (err: any) {

            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message
            });
        }
    };



export const adminMiddleware = async (req: Request , res: Response, next: NextFunction) =>{
    try{
        if(!req.user){
            throw new HttpError(401,"Unauthorized no user infoi");
        }
        if(req.user.role !== 'admin'){
            throw new HttpError(403, 'Forbidden not admin');
        }
        return next();
    } catch (errr: Error | any){
        return res.status(errr.statusCode || 500).json(
            {success: false, message:errr.message}
        )
    }
}
    
