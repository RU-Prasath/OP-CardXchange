import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

interface RegisterRequestBody {
    fullName: string;
    mobile: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

interface RegisterRequest extends Request {
    file?: Express.Multer.File;
    body: RegisterRequestBody;
}

function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export const register = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      mobile,
      email,
      password,
      confirmPassword,
      gender,
      city,
      state,
      pincode,
    } = req.body;

    if (!fullName || !mobile || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Mobile number must be 10 digits." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      mobile,
      email: email.toLowerCase(),
      password: hashed,
      profileImage: req.file ? req.file.path : undefined,
      gender,
      city,
      state,
      pincode,
    });

    const token = signToken(user._id.toString());
    res
      .status(201)
      .json({
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
