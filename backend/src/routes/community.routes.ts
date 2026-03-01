import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { CommunityController } from "../controllers/community.controller";
import { uploads } from "../middlewares/upload.middleware";
import { ReportController } from "../controllers/report.controller";

const router = Router();
const communityController = new CommunityController();
const reportController = new ReportController();

router.get("/search", communityController.searchCommunities);
router.get("/my", authorizedMiddleware, communityController.getMyCommunities);
router.get("/count/:userId", communityController.getUserCommunityCount);
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
router.post("/:communityId/report", authorizedMiddleware, reportController.reportChautari);
router.put(
  "/:communityId",
  authorizedMiddleware,
  uploads.single("communityProfileUrl"),
  communityController.updateCommunity
);
router.delete("/:communityId", authorizedMiddleware, communityController.deleteCommunity);
router.post(
  "/:communityId/posts",
  authorizedMiddleware,
  uploads.single("media"),
  communityController.createPostInCommunity
);

export default router;
