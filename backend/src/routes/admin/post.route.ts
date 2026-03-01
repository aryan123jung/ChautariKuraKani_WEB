import { Router } from "express";
import {
  adminMiddleware,
  authorizedMiddleware
} from "../../middlewares/authorized.middleware";
import { AdminPostController } from "../../controllers/admin/post.controller";

const router = Router();
const adminPostController = new AdminPostController();

router.use(authorizedMiddleware);
router.use(adminMiddleware);

router.get("/", adminPostController.getAllPosts);
router.delete("/:id", adminPostController.deletePost);

export default router;
