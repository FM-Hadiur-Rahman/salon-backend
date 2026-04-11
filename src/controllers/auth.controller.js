import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/generateToken.js";

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await Admin.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
});
