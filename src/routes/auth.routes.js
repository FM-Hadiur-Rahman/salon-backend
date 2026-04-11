import express from "express";
import {
  getMe,
  loginAdmin,
  registerAdmin,
} from "../controllers/auth.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getMe);

export default router;
