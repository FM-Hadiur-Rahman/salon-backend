import asyncHandler from "express-async-handler";
import Setting from "../models/Setting.js";

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  res.json({ success: true, data: settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }

  res.json({ success: true, data: settings });
});
