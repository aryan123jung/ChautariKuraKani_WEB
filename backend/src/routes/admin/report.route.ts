import { Router } from "express";
import {
  adminMiddleware,
  authorizedMiddleware
} from "../../middlewares/authorized.middleware";
import { AdminReportController } from "../../controllers/admin/report.controller";

const router = Router();
const adminReportController = new AdminReportController();

router.use(authorizedMiddleware);
router.use(adminMiddleware);

router.get("/stats", adminReportController.getReportStats);
router.get("/", adminReportController.listReports);
router.get("/:id", adminReportController.getReportById);
router.patch("/:id/assign", adminReportController.assignReport);
router.patch("/:id/resolve", adminReportController.resolveReport);

export default router;
