import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { ReportController } from "../controllers/report.controller";

const router = Router();
const reportController = new ReportController();

router.use(authorizedMiddleware);

router.post("/post/:postId", reportController.reportPost);
router.post("/user/:userId", reportController.reportUser);
router.post("/chautari/:communityId", reportController.reportChautari);
router.get("/my", reportController.getMyReports);

export default router;
