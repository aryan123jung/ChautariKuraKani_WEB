import { CreateUserDto, LoginUserDto } from "../dtos/user.dtos";
import { HttpError } from "../errors/http-error";
import bcryptjs from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { email } from "zod";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../configs";

let userRepository = new UserRepository();
export class UserService{
    async registerUser(userData: CreateUserDto){
        const checkEmail = await userRepository.getUserByEmail(userData.email);
        if(checkEmail){
            throw new HttpError(409,"Email already in use");
        }
        const checkUsername = await userRepository.getUserByUsername(userData.username);
        if(checkUsername){
            throw new HttpError(403, "Username already in use");
        }
        const hashedPassword = await bcryptjs.hash(userData.password,10);
        userData.password = hashedPassword;
        const newUser = await userRepository.createUser(userData);
        return newUser;
    }

    async loginUser(loginData: LoginUserDto){
        const user = await userRepository.getUserByEmail(loginData.email);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        const validPassword = await bcryptjs.compare(loginData.password, user.password);
        if(!validPassword){
            throw new HttpError(401,"Invalid Credential");
        }
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        }
        const token = jwt.sign(payload,JWT_SECRET,{expiresIn: '30d'})
        return { token, user}
    }
}