import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { CommunityController } from "../controllers/community.controller";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const communityController = new CommunityController();

router.get("/search", communityController.searchCommunities);
router.get("/my", authorizedMiddleware, communityController.getMyCommunities);
router.get("/:communityId", communityController.getCommunityById);
router.get("/:communityId/member-count", communityController.getMemberCount);
router.get("/:communityId/posts", communityController.getCommunityPosts);

router.post(
  "/",
  authorizedMiddleware,
  uploads.single("communityProfileUrl"),
  communityController.createCommunity
);
router.post("/:communityId/join", authorizedMiddleware, communityController.joinCommunity);
router.post("/:communityId/leave", authorizedMiddleware, communityController.leaveCommunity);
router.delete("/:communityId", authorizedMiddleware, communityController.deleteCommunity);
router.post(
  "/:communityId/posts",
  authorizedMiddleware,
  uploads.single("media"),
  communityController.createPostInCommunity
);

export default router;
