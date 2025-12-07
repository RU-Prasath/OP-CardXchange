import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
import { sendEmail } from "../utils/sendEmail.js";

const userRepository = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export class AuthService {
  private signToken(id: string): string {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: "7d",
      algorithm: "HS256",
    } as jwt.SignOptions);
  }

  // async register(userData: any, profileImage?: string) {
  //   // Check if user exists
  //   const existingUser = await userRepository.findByEmail(userData.email);
  //   if (existingUser) {
  //     throw new Error("Email already registered");
  //   }

  //   // Hash password
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(userData.password, salt);

  //   // Create user
  //   const user = await userRepository.create({
  //     ...userData,
  //     password: hashedPassword,
  //     profileImage,
  //   });

  //   // Generate token
  //   const token = this.signToken(user._id.toString());

  //   return {
  //     token,
  //     user: {
  //       id: user._id,
  //       fullName: user.fullName,
  //       email: user.email,
  //       isAdmin: user.isAdmin,
  //     },
  //   };
  // }

  async register(
    userId: string,
    userData: any,
    profileImage?: string
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isVerified) {
      throw new Error("User already verified");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Update user with complete information
    const updatedUser = await userRepository.update(userId, {
      fullName: userData.fullName,
      mobile: userData.mobile,
      password: hashedPassword,
      profileImage,
      city: userData.city,
      state: userData.state,
      pincode: userData.pincode,
      isVerified: true,
      emailOtp: undefined,
      emailOtpExpires: undefined,
    });

    if (!updatedUser) {
      throw new Error("Failed to complete registration");
    }

    const token = this.signToken(updatedUser._id.toString());

    return {
      token,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isVerified: updatedUser.isVerified,
        isAdmin: updatedUser.isAdmin,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = this.signToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
        profileImage: user.profileImage || null,
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Update user
    await userRepository.update(user._id.toString(), {
      resetOtp: hashedOtp,
      resetOtpExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Send email
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
    const resetLink = `${CLIENT_URL}/reset-password?email=${encodeURIComponent(
      email
    )}&otp=${otp}`;

    const html = `
      <p>Hi ${user.fullName},</p>
      <p>You requested a password reset. Use the OTP below to reset your password (valid for 15 minutes):</p>
      <h2>${otp}</h2>
      <p>Or click this link to go to the reset page (OTP included in the link):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
    `;

    await sendEmail(email, "Password Reset OTP", html);

    return { message: "OTP sent to email" };
  }

  async resetPassword(email: string, otp: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      throw new Error("Invalid reset request");
    }

    if (user.resetOtpExpires.getTime() < Date.now()) {
      throw new Error("OTP expired");
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) {
      throw new Error("Invalid OTP");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userRepository.update(user._id.toString(), {
      password: hashedPassword,
      resetOtp: undefined,
      resetOtpExpires: undefined,
    });

    const token = this.signToken(user._id.toString());

    return { message: "Password reset successful", token };
  }
}
