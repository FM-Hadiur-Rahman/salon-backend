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
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    couponCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
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
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

appointmentSchema.index({ date: 1, time: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
