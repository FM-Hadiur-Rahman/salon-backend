import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protectAdmin, updateSettings);

export default router;
