import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { CallController } from "../controllers/call.controller";

const router = Router();
const callController = new CallController();

router.use(authorizedMiddleware);

router.get("/", callController.listMyCalls);

export default router;
