import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const hashed = await bcrypt.hash("Admin@123", 10);

    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await User.create({
      fullName: "Admin",
      email: "admin@example.com",
      mobile: "0000000000",
      password: hashed,
      isVerified: true,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();
