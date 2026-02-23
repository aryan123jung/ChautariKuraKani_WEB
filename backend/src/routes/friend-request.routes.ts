import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { FriendRequestController } from "../controllers/friend-request.controller";

const router = Router();
const friendRequestController = new FriendRequestController();

router.use(authorizedMiddleware);

router.post("/requests/:toUserId", friendRequestController.sendRequest);
router.delete("/requests/:toUserId", friendRequestController.cancelRequest);

router.get("/requests/incoming", friendRequestController.getIncomingRequests);
router.get("/requests/outgoing", friendRequestController.getOutgoingRequests);

router.post("/requests/:requestId/accept", friendRequestController.acceptRequest);
router.post("/requests/:requestId/reject", friendRequestController.rejectRequest);

router.delete("/:friendUserId", friendRequestController.unfriend);
router.get("/status/:userId", friendRequestController.getStatus);
router.get("/count/:userId", friendRequestController.getFriendCount);

export default router;
