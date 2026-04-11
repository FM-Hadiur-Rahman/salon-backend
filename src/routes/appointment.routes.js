import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", protectAdmin, getAppointments);
router.patch("/:id/status", protectAdmin, updateAppointmentStatus);
router.delete("/:id", protectAdmin, deleteAppointment);

export default router;
