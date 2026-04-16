import express from "express";
import {
  getSettings,
  updateSettings,
  resetSettings,
} from "../controllers/settings.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// public read
router.get("/", getSettings);

// admin only write/reset
router.put("/", protectAdmin, updateSettings);
router.post("/reset", protectAdmin, resetSettings);

export default router;
