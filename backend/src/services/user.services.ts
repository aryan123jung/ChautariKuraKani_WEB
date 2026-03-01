import { CreateUserDto, LoginUserDto, UpdateUserDto } from "../dtos/user.dtos";
import { HttpError } from "../errors/http-error";
import bcryptjs from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { email } from "zod";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../configs";
import path from "path";
import fs from "fs";
import { sendEmail } from "../configs/email";


let userRepository = new UserRepository();
const mobileResetCodeStore = new Map<
  string,
  { userId: string; code: string; expiresAt: number }
>();
export class UserService {
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
        if (user.accountStatus === "banned") {
            throw new HttpError(403, "Your account is banned");
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

    async searchUsersForUser(currentUserId: string, page?: string, size?: string, search?: string) {
        const pageNumber = page ? parseInt(page) : 1;
        const pageSize = size ? parseInt(size) : 10;

        const { users, total } = await userRepository.searchUsersForUser(
            currentUserId,
            pageNumber,
            pageSize,
            search
        );

        const pagination = {
            page: pageNumber,
            size: pageSize,
            totalUsers: total,
            totalPages: Math.ceil(total / pageSize)
        };

        return { users, pagination };
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

    // async sendResetPasswordEmail(email?: string) {
    //     const CLIENT_URL = process.env.CLIENT_URL || "http://192.168.1.86:3000";
    //     if (!email) {
    //         throw new HttpError(400, "Email is required");
    //     }
    //     const user = await userRepository.getUserByEmail(email);
    //     if (!user) {
    //         throw new HttpError(404, "User not found");
    //     }
    //     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiry
    //     const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
    //     const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
    //     await sendEmail(user.email, "Password Reset", html);
    //     return user;
    // }


    // async resetPassword(token?: string, newPassword?: string) {
    //     try {
    //         if (!token || !newPassword) {
    //             throw new HttpError(400, "Token and new password are required");
    //         }
    //         const decoded: any = jwt.verify(token, JWT_SECRET);
    //         const userId = decoded.id;
    //         const user = await userRepository.getUserById(userId);
    //         if (!user) {
    //             throw new HttpError(404, "User not found");
    //         }
    //         const hashedPassword = await bcryptjs.hash(newPassword, 10);
    //         await userRepository.updateUser(userId, { password: hashedPassword });
    //         return user;
    //     } catch (error) {
    //         throw new HttpError(400, "Invalid or expired token");
    //     }
    // }

    async sendResetPasswordEmail(
      email?: string,
      platform: "web" | "mobile" = "web",
      resetUrl?: string
    ) {
        if (!email) throw new HttpError(400, "Email is required");

        const user = await userRepository.getUserByEmail(email);
        if (!user) throw new HttpError(404, "User not found");

        if (platform === "mobile") {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
            mobileResetCodeStore.set(user.email.toLowerCase(), {
                userId: user._id.toString(),
                code,
                expiresAt
            });

            const html = `
                <p>You requested to reset your password for ChautariKuraKani.</p>
                <p>Your 6-digit reset code is:</p>
                <h2>${code}</h2>
                <p>This code expires in 10 minutes.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
            `;
            const text = `Your ChautariKuraKani password reset code is ${code}. It expires in 10 minutes.`;

            await sendEmail(user.email, "Password Reset Code", html, text);
            return user;
        }

        // Web flow unchanged
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
        const resetBaseUrl = `${CLIENT_URL}/reset-password`;
        const separator = resetBaseUrl.includes("?") ? "&" : "?";
        const resetLink = `${resetBaseUrl}${separator}token=${encodeURIComponent(token)}`;

        const html = `
            <p>Click "<a href="${resetLink}">${resetLink}</a>" to reset your password.</p>
            <p>If your app or email client does not open links, copy the link and paste it into your browser URL.</p>
            <p>This link will expire in 1 hour.</p>
        `;

        const text = `Reset your password using this link (expires in 1 hour): ${resetLink}
                        If the link does not open, copy and paste it into your browser URL.`;

        await sendEmail(user.email, "Password Reset", html, text);
        return user;
    }


  /**
   * Reset user password
   */
  async resetPassword(token?: string, newPassword?: string) {
    if (!token || !newPassword) throw new HttpError(400, "Token and new password are required");

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;
      const user = await userRepository.getUserById(userId);
      if (!user) throw new HttpError(404, "User not found");

      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      await userRepository.updateUser(userId, { password: hashedPassword });

      return user;
    } catch (err) {
      throw new HttpError(400, "Invalid or expired token");
    }
  }

  async resetPasswordWithCode(email?: string, code?: string, newPassword?: string) {
    if (!email || !code || !newPassword) {
      throw new HttpError(400, "Email, code and new password are required");
    }

    const key = email.toLowerCase();
    const stored = mobileResetCodeStore.get(key);
    if (!stored) {
      throw new HttpError(400, "Invalid or expired code");
    }
    if (stored.expiresAt < Date.now()) {
      mobileResetCodeStore.delete(key);
      throw new HttpError(400, "Invalid or expired code");
    }
    if (stored.code !== code) {
      throw new HttpError(400, "Invalid or expired code");
    }

    const user = await userRepository.getUserById(stored.userId);
    if (!user || user.email.toLowerCase() !== key) {
      mobileResetCodeStore.delete(key);
      throw new HttpError(404, "User not found");
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await userRepository.updateUser(stored.userId, { password: hashedPassword });
    mobileResetCodeStore.delete(key);
    return true;
  }

  async verifyResetPasswordMobileCode(email?: string, code?: string) {
    if (!email || !code) {
      throw new HttpError(400, "Email and code are required");
    }

    const key = email.toLowerCase();
    const stored = mobileResetCodeStore.get(key);
    if (!stored) {
      throw new HttpError(400, "Invalid or expired code");
    }
    if (stored.expiresAt < Date.now()) {
      mobileResetCodeStore.delete(key);
      throw new HttpError(400, "Invalid or expired code");
    }
    if (stored.code !== code) {
      throw new HttpError(400, "Invalid or expired code");
    }

    return true;
  }

}
