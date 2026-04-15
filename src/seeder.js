import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./models/Employee.js";
import Service from "./models/Service.js";

dotenv.config();

const employeesData = [
  {
    name: "Sara Klein",
    role: "Color Expertin",
    email: "sara@maison-elegance.de",
    phone: "+49 211 111111",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    bio: "Spezialistin für Balayage, Farbkorrektur und luxuriöse Finish-Looks.",
    isActive: true,
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
  {
    name: "Nina Berger",
    role: "Senior Stylistin",
    email: "nina@maison-elegance.de",
    phone: "+49 211 222222",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
    bio: "Experte für elegante Damenhaarschnitte und Pflege-Rituale.",
    isActive: true,
    workingDays: ["tuesday", "wednesday", "thursday", "friday", "saturday"],
  },
  {
    name: "Amir Yilmaz",
    role: "Barber",
    email: "amir@maison-elegance.de",
    phone: "+49 211 333333",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Spezialist für moderne Herrenhaarschnitte und Grooming.",
    isActive: true,
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Employee.deleteMany();
    await Service.deleteMany();

    const employees = await Employee.insertMany(employeesData);

    const sara = employees.find((e) => e.name === "Sara Klein");
    const nina = employees.find((e) => e.name === "Nina Berger");
    const amir = employees.find((e) => e.name === "Amir Yilmaz");

    const servicesData = [
      {
        name: "Signature Damenhaarschnitt",
        slug: "signature-damenhaarschnitt",
        description:
          "Präziser Damenhaarschnitt mit Premium-Beratung und Styling.",
        price: 79,
        durationMinutes: 60,
        isActive: true,
        capacityPerSlot: 2,
        employeeIds: [sara._id, nina._id],
      },
      {
        name: "Farbe & Balayage Deluxe",
        slug: "farbe-balayage-deluxe",
        description:
          "Luxuriöse Farbveredelung für moderne Looks und natürliche Highlights.",
        price: 189,
        durationMinutes: 180,
        isActive: true,
        capacityPerSlot: 2,
        employeeIds: [sara._id, nina._id],
      },
      {
        name: "Luxury Haarpflege Ritual",
        slug: "luxury-haarpflege-ritual",
        description:
          "Intensive Premium-Pflegebehandlung für Glanz, Struktur und Wellness.",
        price: 59,
        durationMinutes: 40,
        isActive: true,
        capacityPerSlot: 2,
        employeeIds: [sara._id, nina._id],
      },
      {
        name: "Executive Herrenhaarschnitt",
        slug: "executive-herrenhaarschnitt",
        description: "Moderner Herrenhaarschnitt mit präzisem Finish.",
        price: 49,
        durationMinutes: 40,
        isActive: true,
        capacityPerSlot: 1,
        employeeIds: [amir._id],
      },
    ];

    const services = await Service.insertMany(servicesData);

    console.log(
      `Seed complete: ${employees.length} employees, ${services.length} services`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
