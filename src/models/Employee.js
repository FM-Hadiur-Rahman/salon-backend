import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional working hours / availability later
    workingDays: {
      type: [String],
      default: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  },
  { timestamps: true },
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
