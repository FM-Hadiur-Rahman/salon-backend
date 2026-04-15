import express from "express";
import {
  getEmployees,
  getAdminEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
} from "../controllers/employeeController.js";

const router = express.Router();

// Public / general
router.get("/", getEmployees);

// Admin
router.get("/admin", getAdminEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.patch("/:id/toggle-status", toggleEmployeeStatus);

export default router;
