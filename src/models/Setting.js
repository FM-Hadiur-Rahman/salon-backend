import mongoose from "mongoose";

const openingHoursSchema = new mongoose.Schema(
  {
    monday: { type: String, default: "09:00 - 18:00" },
    tuesday: { type: String, default: "09:00 - 18:00" },
    wednesday: { type: String, default: "09:00 - 18:00" },
    thursday: { type: String, default: "09:00 - 18:00" },
    friday: { type: String, default: "09:00 - 18:00" },
    saturday: { type: String, default: "10:00 - 16:00" },
    sunday: { type: String, default: "Closed" },
  },
  { _id: false },
);

const settingSchema = new mongoose.Schema(
  {
    salonName: { type: String, default: "Maison Élégance" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    bookingEnabled: { type: Boolean, default: true },
    openingHours: {
      type: openingHoursSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
