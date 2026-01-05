import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/authorized.middleware";
import { Request, Response } from "express";


let adminUserController = new AdminUserController();

const router = Router();


router.get("/test", authorizedMiddleware, adminMiddleware,
    (req:Request,res:Response )=> {
        res.status(200).json({success: true, message: 'Welcome to admin'});
    }
)


router.post("/",adminUserController.createUser);
router.get("/:id",adminUserController.getOneUser);


export default router;