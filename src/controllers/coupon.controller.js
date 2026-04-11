import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

export const getPublicCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({
    isActive: true,
    isPublic: true,
  }).populate("appliesToService", "name");

  res.json({ success: true, data: coupons });
});

export const getAdminCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().populate("appliesToService", "name");
  res.json({ success: true, data: coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    code: req.body.code?.toUpperCase(),
  };

  const coupon = await Coupon.create(payload);
  res.status(201).json({ success: true, data: coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    code: req.body.code?.toUpperCase(),
  };

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  res.json({ success: true, data: coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  res.json({ success: true, message: "Coupon deleted" });
});
