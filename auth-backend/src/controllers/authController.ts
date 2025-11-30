import type { Request, Response } from "express";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const JWT_SECRET: Secret = (process.env.JWT_SECRET as string) ?? "secret";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

function signToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  } as jwt.SignOptions);
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
    } = req.body as any;

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
      profileImage: (req as any).file ? (req as any).file.path : undefined,
      gender,
      city,
      state,
      pincode,
    });

    const token = signToken(user._id.toString());
    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as any;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = signToken(user._id.toString());
    res.status(200).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send OTP to email and include link to frontend reset page
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as any;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });

    // generate numeric 6-digit otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash otp before storing
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // set expiry 15 minutes
    user.resetOtp = hashedOtp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // create link for frontend that includes email & otp (frontend will read otp from query)
    const resetLink = `${CLIENT_URL}/reset-password?email=${encodeURIComponent(
      user.email
    )}&otp=${otp}`;

    const html = `
      <p>Hi ${user.fullName},</p>
      <p>You requested a password reset. Use the OTP below to reset your password (valid for 15 minutes):</p>
      <h2>${otp}</h2>
      <p>Or click this link to go to the reset page (OTP included in the link):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail(user.email, "Password Reset OTP", html);
    } catch (emailError) {
      console.error("sendEmail failed:", emailError);
    }

    return res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accepts { email, otp, password, confirmPassword }
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password, confirmPassword } = req.body as any;
    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No reset request found." });
    }

    if (user.resetOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP." });

    // update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // clear otp fields
    user.resetOtp = undefined as any;
    user.resetOtpExpires = undefined as any;

    await user.save();

    // optionally issue token after reset
    const token = signToken(user._id.toString());

    return res.status(200).json({ message: "Password reset success.", token });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
