import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 30,
      min: 15,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional generic capacity fallback
    capacityPerSlot: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Which employees can perform this service
    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
  },
  { timestamps: true },
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
