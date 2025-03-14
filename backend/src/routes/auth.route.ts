import { Router } from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", verifyToken, updateProfile);

router.get("/check", verifyToken, checkAuth);

export default router;
