import express from "express";
import {
  createService,
  deleteService,
  getAdminServices,
  getServices,
  updateService,
} from "../controllers/service.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getServices);
router.get("/admin/all", protectAdmin, getAdminServices);
router.post("/", protectAdmin, createService);
router.put("/:id", protectAdmin, updateService);
router.delete("/:id", protectAdmin, deleteService);

export default router;
