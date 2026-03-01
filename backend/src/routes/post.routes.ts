import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { ReportController } from "../controllers/report.controller";

const router = Router();
const postController = new PostController();
const reportController = new ReportController();

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

router.get(
  "/:id",
  postController.getOnePost
);

router.post(
  "/:id/like",
  authorizedMiddleware,
  postController.likePost
);

router.post(
  "/:id/comments",
  authorizedMiddleware,
  postController.createComment
);

router.post(
  "/:id/report",
  authorizedMiddleware,
  (req, res) => {
    req.params.postId = req.params.id;
    return reportController.reportPost(req, res);
  }
);

router.get(
  "/:id/comments",
  postController.getPostComments
);

router.delete(
  "/:id/comments/:commentId",
  authorizedMiddleware,
  postController.deletePostComment
);

router.put(
  "/:id",
  authorizedMiddleware,
  uploads.single("media"),
  postController.updateOnePost
);

router.delete(
  "/:id",
  authorizedMiddleware,
  postController.deleteOnePost
);

export default router;
