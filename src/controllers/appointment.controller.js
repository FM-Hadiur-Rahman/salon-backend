import asyncHandler from "express-async-handler";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import Employee from "../models/Employee.js";
import Coupon from "../models/Coupon.js";
import { calculateDiscount } from "../utils/applyCoupon.js";
import { sendAppointmentConfirmation } from "../utils/email.js";

export const createAppointment = asyncHandler(async (req, res) => {
  const {
    name,
    contact,
    serviceId,
    employeeId,
    date,
    time,
    message,
    couponCode,
  } = req.body;

  if (!name || !contact || !serviceId || !date || !time) {
    res.status(400);
    throw new Error("Please provide name, contact, service, date, and time");
  }

  const service = await Service.findById(serviceId).populate("employeeIds");
  if (!service || !service.isActive) {
    res.status(400);
    throw new Error("Selected service is not available");
  }

  let assignedEmployee = null;

  if (employeeId) {
    const selectedEmployee = await Employee.findById(employeeId);

    if (!selectedEmployee || !selectedEmployee.isActive) {
      res.status(400);
      throw new Error("Selected employee is not available");
    }

    const canPerformService = service.employeeIds.some(
      (emp) => String(emp._id) === String(employeeId),
    );

    if (!canPerformService) {
      res.status(400);
      throw new Error("Selected employee cannot perform this service");
    }

    const existingAppointment = await Appointment.findOne({
      employee: employeeId,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingAppointment) {
      res.status(400);
      throw new Error("This employee is already booked for that time slot");
    }

    assignedEmployee = selectedEmployee;
  } else {
    const availableEmployees = [];

    for (const employee of service.employeeIds) {
      if (!employee.isActive) continue;

      const existingAppointment = await Appointment.findOne({
        employee: employee._id,
        date,
        time,
        status: { $in: ["pending", "confirmed"] },
      });

      if (!existingAppointment) {
        availableEmployees.push(employee);
      }
    }

    if (availableEmployees.length === 0) {
      res.status(400);
      throw new Error("No employees are available for this time slot");
    }

    assignedEmployee = availableEmployees[0];
  }

  let coupon = null;
  if (couponCode?.trim()) {
    coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
  }

  const { discountAmount, finalPrice } = calculateDiscount({
    servicePrice: service.price,
    coupon,
    serviceId,
  });

  const appointment = await Appointment.create({
    customerName: name.trim(),
    contact: contact.trim(),
    service: serviceId,
    employee: assignedEmployee._id,
    date: date.trim(),
    time: time.trim(),
    message: message?.trim() || "",
    couponCode: coupon ? coupon.code : "",
    originalPrice: service.price,
    discountAmount,
    finalPrice,
    status: "pending",
  });

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  const populated = await Appointment.findById(appointment._id)
    .populate("service", "name price durationMinutes")
    .populate("employee", "name role");

  res.status(201).json({
    success: true,
    message: "Appointment created successfully",
    data: populated,
  });

  if (contact.includes("@")) {
    sendAppointmentConfirmation({
      to: contact,
      customerName: name,
      serviceName: service.name,
      date,
      time,
    }).catch((emailError) => {
      console.error("Email send failed:", emailError.message);
    });
  }
});

export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("service", "name price durationMinutes")
    .populate("employee", "name role")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: appointments });
});

export const getBookedSlotsByDate = asyncHandler(async (req, res) => {
  const { date, serviceId, employeeId } = req.query;

  if (!date || !serviceId) {
    res.status(400);
    throw new Error("Date and serviceId are required");
  }

  const service = await Service.findById(serviceId).populate("employeeIds");
  if (!service || !service.isActive) {
    res.status(404);
    throw new Error("Service not found");
  }

  // If a specific employee is selected:
  // return only slots where that employee is busy
  if (employeeId) {
    const appointments = await Appointment.find({
      employee: employeeId,
      date,
      status: { $in: ["pending", "confirmed"] },
    }).select("time");

    const bookedSlots = appointments.map((item) => item.time);

    return res.json({
      success: true,
      data: bookedSlots,
    });
  }

  // If no specific employee is selected:
  // hide a slot only when ALL eligible employees are busy
  const activeEmployees = service.employeeIds.filter((emp) => emp.isActive);
  const totalCapacity = activeEmployees.length;

  const appointments = await Appointment.find({
    service: serviceId,
    date,
    status: { $in: ["pending", "confirmed"] },
  }).select("time employee");

  const slotEmployeeMap = {};

  for (const appointment of appointments) {
    const slot = appointment.time;
    if (!slotEmployeeMap[slot]) {
      slotEmployeeMap[slot] = new Set();
    }
    slotEmployeeMap[slot].add(String(appointment.employee));
  }

  const fullyBookedSlots = Object.entries(slotEmployeeMap)
    .filter(([, employeeSet]) => employeeSet.size >= totalCapacity)
    .map(([time]) => time);

  res.json({
    success: true,
    data: fullyBookedSlots,
    meta: {
      totalCapacity,
    },
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];
  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  )
    .populate("service", "name price durationMinutes")
    .populate("employee", "name role");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  res.json({ success: true, data: appointment });
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  res.json({ success: true, message: "Appointment deleted" });
});
