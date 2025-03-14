import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller";

const router = Router();

router.get("/users", verifyToken, getUsersForSidebar);

router.get("/:id", verifyToken, getMessages);

router.post("/send/:id", verifyToken, sendMessage);

export default router;
