import asyncHandler from "express-async-handler";
import Employee from "../models/Employee.js";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";

// Public: only active employees
export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    data: employees,
  });
});

// Admin: all employees
export const getAdminEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: employees,
  });
});

// Get one employee
export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.json({
    success: true,
    data: employee,
  });
});

// Create employee
export const createEmployee = asyncHandler(async (req, res) => {
  const { name, role, email, phone, image, bio, isActive, workingDays } =
    req.body;

  if (!name?.trim()) {
    res.status(400);
    throw new Error("Employee name is required");
  }

  const employee = await Employee.create({
    name: name.trim(),
    role: role?.trim() || "",
    email: email?.trim().toLowerCase() || "",
    phone: phone?.trim() || "",
    image: image?.trim() || "",
    bio: bio?.trim() || "",
    isActive: typeof isActive === "boolean" ? isActive : true,
    workingDays: Array.isArray(workingDays) ? workingDays : undefined,
  });

  res.status(201).json({
    success: true,
    data: employee,
  });
});

// Update employee
export const updateEmployee = asyncHandler(async (req, res) => {
  const { name, role, email, phone, image, bio, isActive, workingDays } =
    req.body;

  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.name = name?.trim() || employee.name;
  employee.role = role?.trim() ?? employee.role;
  employee.email = email?.trim().toLowerCase() ?? employee.email;
  employee.phone = phone?.trim() ?? employee.phone;
  employee.image = image?.trim() ?? employee.image;
  employee.bio = bio?.trim() ?? employee.bio;

  if (typeof isActive === "boolean") {
    employee.isActive = isActive;
  }

  if (Array.isArray(workingDays)) {
    employee.workingDays = workingDays;
  }

  await employee.save();

  res.json({
    success: true,
    data: employee,
  });
});

// Delete employee
// optional safety: prevent delete if used in appointments/services
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const usedInAppointments = await Appointment.exists({
    employee: employee._id,
  });

  const usedInServices = await Service.exists({
    employeeIds: employee._id,
  });

  if (usedInAppointments || usedInServices) {
    res.status(400);
    throw new Error(
      "Employee cannot be deleted because it is linked to appointments or services",
    );
  }

  await employee.deleteOne();

  res.json({
    success: true,
    message: "Employee deleted successfully",
  });
});

// Toggle active/inactive
export const toggleEmployeeStatus = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.isActive = !employee.isActive;
  await employee.save();

  res.json({
    success: true,
    data: employee,
  });
});
