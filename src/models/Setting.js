import mongoose from "mongoose";

const openingHoursSchema = new mongoose.Schema(
  {
    monday: { type: String, default: "09:00 - 18:00" },
    tuesday: { type: String, default: "09:00 - 18:00" },
    wednesday: { type: String, default: "09:00 - 18:00" },
    thursday: { type: String, default: "09:00 - 20:00" },
    friday: { type: String, default: "09:00 - 20:00" },
    saturday: { type: String, default: "10:00 - 16:00" },
    sunday: { type: String, default: "Closed" },
  },
  { _id: false },
);

const settingSchema = new mongoose.Schema(
  {
    salonName: {
      type: String,
      trim: true,
      default: "Maison Élégance",
    },
    phone: {
      type: String,
      trim: true,
      default: "+49 211 12345678",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "hello@maison-elegance.de",
    },
    address: {
      type: String,
      trim: true,
      default: "Königsallee 25, 40212 Düsseldorf",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },

    slotDuration: {
      type: Number,
      default: 30,
      min: 5,
    },
    breakBetweenAppointments: {
      type: Number,
      default: 10,
      min: 0,
    },
    cancellationHours: {
      type: Number,
      default: 24,
      min: 0,
    },

    allowOnlineBooking: {
      type: Boolean,
      default: true,
    },
    showPrices: {
      type: Boolean,
      default: true,
    },

    primaryColor: {
      type: String,
      default: "#d8b46a",
    },
    secondaryColor: {
      type: String,
      default: "#1b0f14",
    },
    logoPreview: {
      type: String,
      default: "",
    },

    openingHours: {
      type: openingHoursSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
