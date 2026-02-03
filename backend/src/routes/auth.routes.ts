import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

let authController = new AuthController();

const router = Router();
router.post("/register", authController.createUser)
router.post("/login", authController.loginUser)

router.get("/whoami", authorizedMiddleware, authController.getUserById);
router.get("/user/:id", authorizedMiddleware, authController.getCurrentUser);

router.put(
    "/update-profile",
    authorizedMiddleware,
    // uploads.single("image"),
    uploads.fields([
        { name: "profileUrl", maxCount: 1 },
        { name: "coverUrl", maxCount: 1 }
    ]),
    authController.updateUser
);

router.post(
    "/send-reset-password-email",
    authController.requestPasswordChange
);

export default router;