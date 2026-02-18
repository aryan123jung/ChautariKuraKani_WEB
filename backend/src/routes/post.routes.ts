import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const postController = new PostController();

router.post(
  "/",
  authorizedMiddleware,
  uploads.single("media"),
  postController.createPost
);

router.get(
  "/",
  postController.getAllPosts
);

router.delete(
  "/:id",
  authorizedMiddleware,
  postController.deleteOnePost
);

export default router;
