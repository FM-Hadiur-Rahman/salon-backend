import asyncHandler from "express-async-handler";
import Setting from "../models/Setting.js";

const defaultSettings = {
  salonName: "Maison Élégance",
  phone: "+49 211 12345678",
  email: "hello@maison-elegance.de",
  address: "Königsallee 25, 40212 Düsseldorf",
  website: "",
  slotDuration: 30,
  breakBetweenAppointments: 10,
  cancellationHours: 24,
  allowOnlineBooking: true,
  showPrices: true,
  primaryColor: "#d8b46a",
  secondaryColor: "#1b0f14",
  logoPreview: "",
  openingHours: {
    monday: "09:00 - 18:00",
    tuesday: "09:00 - 18:00",
    wednesday: "09:00 - 18:00",
    thursday: "09:00 - 20:00",
    friday: "09:00 - 20:00",
    saturday: "10:00 - 16:00",
    sunday: "Closed",
  },
};

const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create(defaultSettings);
  }

  return settings;
};

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.json({
    success: true,
    data: settings,
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const {
    salonName,
    phone,
    email,
    address,
    website,
    slotDuration,
    breakBetweenAppointments,
    cancellationHours,
    allowOnlineBooking,
    showPrices,
    primaryColor,
    secondaryColor,
    logoPreview,
    openingHours,
  } = req.body;

  if (!salonName?.trim()) {
    res.status(400);
    throw new Error("Salon name is required");
  }

  if (!phone?.trim()) {
    res.status(400);
    throw new Error("Phone number is required");
  }

  if (!email?.trim()) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400);
    throw new Error("Enter a valid email address");
  }

  if (!address?.trim()) {
    res.status(400);
    throw new Error("Address is required");
  }

  if (Number(slotDuration) < 5) {
    res.status(400);
    throw new Error("Slot duration must be at least 5 minutes");
  }

  if (Number(breakBetweenAppointments) < 0) {
    res.status(400);
    throw new Error("Break time cannot be negative");
  }

  if (Number(cancellationHours) < 0) {
    res.status(400);
    throw new Error("Cancellation time cannot be negative");
  }

  let settings = await Setting.findOne();

  if (!settings) {
    settings = new Setting(defaultSettings);
  }

  settings.salonName = salonName.trim();
  settings.phone = phone.trim();
  settings.email = email.trim().toLowerCase();
  settings.address = address.trim();
  settings.website = website?.trim() || "";
  settings.slotDuration = Number(slotDuration);
  settings.breakBetweenAppointments = Number(breakBetweenAppointments);
  settings.cancellationHours = Number(cancellationHours);
  settings.allowOnlineBooking = Boolean(allowOnlineBooking);
  settings.showPrices = Boolean(showPrices);
  settings.primaryColor = primaryColor || "#d8b46a";
  settings.secondaryColor = secondaryColor || "#1b0f14";
  settings.logoPreview = logoPreview || "";

  settings.openingHours = {
    monday: openingHours?.monday || "09:00 - 18:00",
    tuesday: openingHours?.tuesday || "09:00 - 18:00",
    wednesday: openingHours?.wednesday || "09:00 - 18:00",
    thursday: openingHours?.thursday || "09:00 - 20:00",
    friday: openingHours?.friday || "09:00 - 20:00",
    saturday: openingHours?.saturday || "10:00 - 16:00",
    sunday: openingHours?.sunday || "Closed",
  };

  await settings.save();

  res.json({
    success: true,
    message: "Settings saved successfully",
    data: settings,
  });
});

export const resetSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create(defaultSettings);
  } else {
    settings.salonName = defaultSettings.salonName;
    settings.phone = defaultSettings.phone;
    settings.email = defaultSettings.email;
    settings.address = defaultSettings.address;
    settings.website = defaultSettings.website;
    settings.slotDuration = defaultSettings.slotDuration;
    settings.breakBetweenAppointments =
      defaultSettings.breakBetweenAppointments;
    settings.cancellationHours = defaultSettings.cancellationHours;
    settings.allowOnlineBooking = defaultSettings.allowOnlineBooking;
    settings.showPrices = defaultSettings.showPrices;
    settings.primaryColor = defaultSettings.primaryColor;
    settings.secondaryColor = defaultSettings.secondaryColor;
    settings.logoPreview = defaultSettings.logoPreview;
    settings.openingHours = defaultSettings.openingHours;

    await settings.save();
  }

  res.json({
    success: true,
    message: "Settings reset to default values",
    data: settings,
  });
});
