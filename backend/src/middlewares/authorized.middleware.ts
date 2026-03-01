import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs";
import { HttpError } from "../errors/http-error";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any> | IUser;
    }
  }
}

const userRepository = new UserRepository();

export const authorizedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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

    if (user.accountStatus === "banned") {
      throw new HttpError(403, "Your account is banned");
    }

    if (user.accountStatus === "suspended") {
      const suspensionUntil = user.suspensionUntil ? new Date(user.suspensionUntil) : null;
      if (!suspensionUntil || suspensionUntil > new Date()) {
        throw new HttpError(403, "Your account is suspended");
      }

      // Auto-reactivate when suspension time has passed.
      await userRepository.updateUser(user._id.toString(), {
        accountStatus: "active",
        suspensionUntil: undefined
      } as any);
      user.accountStatus = "active";
      user.suspensionUntil = undefined;
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

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Unauthorized no user info");
    }
    if (req.user.role !== "admin") {
      throw new HttpError(403, "Forbidden not admin");
    }
    return next();
  } catch (err: Error | any) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }
};
