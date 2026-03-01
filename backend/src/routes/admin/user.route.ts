// import { Router } from "express";
// import { AdminUserController } from "../../controllers/admin/user.controller";
// import { adminMiddleware, authorizedMiddleware } from "../../middlewares/authorized.middleware";
// import { Request, Response } from "express";


// let adminUserController = new AdminUserController();

// const router = Router();


// router.use(authorizedMiddleware);
// router.use(adminMiddleware);

// router.get("/test", authorizedMiddleware, adminMiddleware,
//     (req:Request,res:Response )=> {
//         res.status(200).json({success: true, message: 'Welcome to admin'});
//     }
// )


// router.post("/",adminUserController.createUser);
// router.get("/:id",adminUserController.getUserById);


// export default router;



import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";  // adjust path if needed

const router = Router();
const adminUserController = new AdminUserController();

router.use(authorizedMiddleware);
router.use(adminMiddleware);


router.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to admin"
    });
});



// router.post("/", adminUserController.createUser);
router.post(
  "/",
  uploads.fields([
    { name: "profileUrl", maxCount: 1 },
    { name: "coverUrl", maxCount: 1 }
  ]),
  adminUserController.createUser
);

router.get("/", adminUserController.getAllUser);

router.get("/:id/profile", adminUserController.getUserProfile);

router.get("/:id", adminUserController.getUserById);

router.put("/:id",
    uploads.fields([
        { name: "profileUrl", maxCount: 1 },
        { name: "coverUrl", maxCount: 1 }
    ]),
    adminUserController.updateUser
);
router.patch("/:id/status", adminUserController.updateUserStatus);

router.delete("/:id", adminUserController.deleteUser);

export default router;
