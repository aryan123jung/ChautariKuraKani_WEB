import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { MessageController } from "../controllers/message.controller";

const router = Router();
const messageController = new MessageController();

router.use(authorizedMiddleware);

router.post("/conversations/:otherUserId", messageController.getOrCreateConversation);
router.get("/conversations", messageController.listConversations);

router.get("/:conversationId", messageController.listMessages);
router.post("/:conversationId", messageController.sendMessage);
router.patch("/:conversationId/read", messageController.markRead);

export default router;
