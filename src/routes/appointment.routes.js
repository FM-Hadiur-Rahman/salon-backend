import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  getBookedSlotsByDate,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// public
router.post("/", createAppointment);
router.get("/booked-slots", getBookedSlotsByDate);

// admin
router.get("/", protectAdmin, getAppointments);
router.patch("/:id/status", protectAdmin, updateAppointmentStatus);
router.delete("/:id", protectAdmin, deleteAppointment);

export default router;
