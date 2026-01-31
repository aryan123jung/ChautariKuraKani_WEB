import { CreateUserDto, LoginUserDto, UpdateUserDto } from "../dtos/user.dtos";
import { HttpError } from "../errors/http-error";
import bcryptjs from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { email } from "zod";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../configs";
import path from "path";
import fs from "fs";


let userRepository = new UserRepository();
export class UserService {
    // async registerUser(userData: CreateUserDto){
    //     const checkEmail = await userRepository.getUserByEmail(userData.email);
    //     if(checkEmail){
    //         throw new HttpError(409,"Email already in use");
    //     }
    //     const checkUsername = await userRepository.getUserByUsername(userData.username);
    //     if(checkUsername){
    //         throw new HttpError(403, "Username already in use");
    //     }
    //     const hashedPassword = await bcryptjs.hash(userData.password,10);
    //     userData.password = hashedPassword;
    //     const newUser = await userRepository.createUser(userData);
    //     return newUser;
    // }
    async registerUser(userData: CreateUserDto) {
        const checkEmail = await userRepository.getUserByEmail(userData.email);
        if (checkEmail) {
            throw new HttpError(409, "Email already in use");
        }

        const checkUsername = await userRepository.getUserByUsername(userData.username);
        if (checkUsername) {
            throw new HttpError(403, "Username already in use");
        }

        // Remove confirmPassword before saving
        const { confirmPassword, ...userToSave } = userData;

        // Hash password
        userToSave.password = await bcryptjs.hash(userToSave.password, 10);

        // Save user
        const newUser = await userRepository.createUser(userToSave);

        // Remove password before sending response
        const { password, ...safeUser } = newUser.toObject();

        return safeUser;
    }


    async loginUser(loginData: LoginUserDto) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const validPassword = await bcryptjs.compare(loginData.password, user.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid Credential");
        }
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
        return { token, user }
    }

    async getUserById(userId: string) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found")
        }
        return user;
    }

    async updateUser(
        userId: string,
        data: UpdateUserDto,
        files?: {
            profileUrl?: Express.Multer.File[];
            coverUrl?: Express.Multer.File[];
        }
    ) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        // if(file){
        //     //delete old image if exists
        //     if(user.profileUrl){
        //         const oldImagePath = path.resolve(
        //             process.cwd(),"uploads/profile",user.profileUrl
        //         );

        //         if (fs.existsSync(oldImagePath)) {
        //         fs.unlinkSync(oldImagePath);
        //         }
        //     }

        //     // store only filename
        //     data.profileUrl = file.filename;
        // }
        // PROFILE IMAGE
        if (files?.profileUrl?.[0]) {
            if (user.profileUrl) {
                const oldPath = path.resolve(
                    process.cwd(),
                    "uploads/profile",
                    user.profileUrl
                );
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            data.profileUrl = files.profileUrl[0].filename;
        }

        // COVER IMAGE
        if (files?.coverUrl?.[0]) {
            if (user.coverUrl) {
                const oldPath = path.resolve(
                    process.cwd(),
                    "uploads/cover",
                    user.coverUrl
                );
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            data.coverUrl = files.coverUrl[0].filename;
        }

        if (user.email !== data.email) {
            const checkEmail = await userRepository.getUserByEmail(data.email!);
            if (checkEmail) {
                throw new HttpError(409, "Email already in use");
            }
        }
        if (user.username !== data.username) {
            const checkUsername = await userRepository.getUserByUsername(data.username!);
            if (checkUsername) {
                throw new HttpError(403, "Username already in use");
            }
        }
        if (data.password) {
            const hashedPassword = await bcryptjs.hash(data.password, 10);
            data.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUser(userId, data);
        return updatedUser;
    }

    //     async updateUser(
    //     userId: string,
    //     data: UpdateUserDto,
    //     file?: Express.Multer.File,
    //   ) {
    //     const user = await userRepository.getUserById(userId);
    //     if (!user) throw new HttpError(404, "User not found");

    //     if (file) {
    //       // delete old image if exists
    //       if (user.profileImage) {
    //         const oldImagePath = path.resolve(
    //           process.cwd(),
    //           "uploads/profile",
    //           user.profileImage,
    //         );

    //         if (fs.existsSync(oldImagePath)) {
    //           fs.unlinkSync(oldImagePath);
    //         }
    //       }

    //       // store only filename
    //       data.profileImage = file.filename;
    //     }

    //     if (data.email && user.email !== data.email) {
    //       const checkEmail = await userRepository.getUserByEmail(data.email);
    //       if (checkEmail) throw new HttpError(409, "Email already in use");
    //     }

    //     if (data.password) {
    //       data.password = await bcryptjs.hash(data.password, 10);
    //     }

    //     return await userRepository.updateUser(userId, data);
    //   }

    //   async getAllUsers() {
    //     const users = await userRepository.getNormalUsers();

    //     if (!users || users.length === 0) {
    //       return [];
    //     }

    //     return users;
    //   }

}