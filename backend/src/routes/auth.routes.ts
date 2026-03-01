import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { ReportController } from "../controllers/report.controller";

let authController = new AuthController();
const reportController = new ReportController();

const router = Router();
router.post("/register", authController.createUser)
router.post("/login", authController.loginUser)

router.get("/whoami", authorizedMiddleware, authController.getUserById);
router.get("/users", authorizedMiddleware, authController.searchUsers);
router.get("/user/:id", authorizedMiddleware, authController.getCurrentUser);
router.post("/user/:userId/report", authorizedMiddleware, reportController.reportUser);

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
router.post("/reset-password/:token", authController.resetPassword);
router.post("/verify-reset-password-mobile-code", authController.verifyResetPasswordMobileCode);
router.post("/reset-password-mobile-code", authController.resetPasswordMobileCode);

export default router;
