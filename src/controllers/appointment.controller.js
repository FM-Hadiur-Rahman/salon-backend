import asyncHandler from "express-async-handler";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import Coupon from "../models/Coupon.js";
import { calculateDiscount } from "../utils/applyCoupon.js";
import { sendAppointmentConfirmation } from "../utils/email.js";

export const createAppointment = asyncHandler(async (req, res) => {
  const { name, contact, serviceId, date, time, message, couponCode } =
    req.body;

  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    res.status(400);
    throw new Error("Selected service is not available");
  }

  const existingAppointment = await Appointment.findOne({
    service: serviceId,
    date,
    time,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error("This time slot is already booked");
  }

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  }

  const { discountAmount, finalPrice } = calculateDiscount({
    servicePrice: service.price,
    coupon,
    serviceId,
  });

  const appointment = await Appointment.create({
    customerName: name,
    contact,
    service: serviceId,
    date,
    time,
    message,
    couponCode: coupon ? coupon.code : "",
    originalPrice: service.price,
    discountAmount,
    finalPrice,
  });

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  const populated = await Appointment.findById(appointment._id).populate(
    "service",
    "name price durationMinutes",
  );

  res.status(201).json({ success: true, data: populated });

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
    .sort({ createdAt: -1 });

  res.json({ success: true, data: appointments });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  ).populate("service", "name");

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
export const getBookedSlotsByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error("Date is required");
  }

  const appointments = await Appointment.find({
    date,
    status: { $in: ["pending", "confirmed"] },
  }).select("time");

  const bookedSlots = appointments.map((item) => item.time);

  res.json({
    success: true,
    data: bookedSlots,
  });
});
