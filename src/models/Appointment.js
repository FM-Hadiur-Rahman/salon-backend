import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: false,
      default: null,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    couponCode: {
      type: String,
      trim: true,
      default: "",
    },

    originalPrice: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
