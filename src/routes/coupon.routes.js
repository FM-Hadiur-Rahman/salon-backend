import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAdminCoupons,
  getPublicCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getPublicCoupons);
router.get("/admin/all", protectAdmin, getAdminCoupons);
router.post("/", protectAdmin, createCoupon);
router.put("/:id", protectAdmin, updateCoupon);
router.delete("/:id", protectAdmin, deleteCoupon);

export default router;
