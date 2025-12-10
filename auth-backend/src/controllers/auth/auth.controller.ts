// import type { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import User from "../../models/User.js";
// import { loginSchema, registerSchema } from "../../schemas/auth/register.schema.js";
// import { AuthService } from "../../services/auth.service.js";
// import { sendEmail } from "../../utils/sendEmail.js";
// import { uploadProfile } from "../../utils/storage/upload.js";

// const authService = new AuthService();

// export const register = async (req: Request, res: Response) => {
//   try {
//     // Validate request body
//     const { error } = registerSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const profileImage = (req as any).file?.path;
//     const result = await authService.register(req.body, profileImage);

//     res.status(201).json(result);
//   } catch (error: any) {
//     console.error("Register error:", error);
//     res.status(400).json({ message: error.message || "Server error" });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { error } = loginSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const { email, password } = req.body;
//     const result = await authService.login(email, password);

//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Login error:", error);
//     res.status(400).json({ message: error.message || "Server error" });
//   }
// };

// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const result = await authService.forgotPassword(email);
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Forgot password error:", error);
//     res.status(400).json({ message: error.message || "Server error" });
//   }
// };

// export const resetPassword = async (req: Request, res: Response) => {
//   try {
//     const { email, otp, password, confirmPassword } = req.body;

//     if (!email || !otp || !password || !confirmPassword) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     const result = await authService.resetPassword(email, otp, password);
//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Reset password error:", error);
//     res.status(400).json({ message: error.message || "Server error" });
//   }
// };

// export const sendEmailOtp = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     let user: any = await User.findOne({ email: email.toLowerCase() });

//     if (user && user.isVerified) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     const salt = await bcrypt.genSalt(10);
//     const hashedOtp = await bcrypt.hash(otp, salt);

//     if (!user) {
//       user = await User.create({
//         email: email.toLowerCase(),
//         fullName: "temp", // placeholder
//         mobile: "0000000000", // placeholder
//         password: "Temp@1234", // placeholder
//         emailOtp: hashedOtp,
//         emailOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
//         isVerified: false,
//       } as any);
//     } else {
//       user.emailOtp = hashedOtp;
//       user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
//       await user.save();
//     }

//     const html = `<p>Your OTP for email verification is: <strong>${otp}</strong></p>
//                   <p>Valid for 10 minutes.</p>`;

//     try {
//       await sendEmail(user.email, "Email Verification OTP", html);
//     } catch (emailError) {
//       console.error("sendEmail failed:", emailError);
//       return res.status(500).json({ message: "Failed to send OTP email" });
//     }

//     return res.status(200).json({ message: "OTP sent to email." });
//   } catch (error) {
//     console.error("sendEmailOtp error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Use multer to handle file upload
// export const verifyEmailOtp = [
//   uploadProfile.single("profile"), // parse profile image if exists
//   async (req: Request, res: Response) => {
//     try {
//       const {
//         email,
//         otp,
//         fullName,
//         mobile,
//         password,
//         confirmPassword,
//         city,
//         state,
//         pincode,
//       } = req.body;

//       if (
//         !email ||
//         !otp ||
//         !fullName ||
//         !mobile ||
//         !password ||
//         !confirmPassword
//       ) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }

//       if (password !== confirmPassword) {
//         return res.status(400).json({ message: "Passwords do not match" });
//       }

//       if (password.length < 6) {
//         return res
//           .status(400)
//           .json({ message: "Password must be at least 6 characters" });
//       }

//       const user = await User.findOne({ email: email.toLowerCase() });
//       if (!user || !user.emailOtp || !user.emailOtpExpires) {
//         return res.status(400).json({ message: "No OTP request found" });
//       }

//       if (user.emailOtpExpires.getTime() < Date.now()) {
//         return res.status(400).json({ message: "OTP expired" });
//       }

//       const isMatch = await bcrypt.compare(otp, user.emailOtp);
//       if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

//       // hash password
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);

//       // update other fields
//       user.fullName = fullName;
//       user.mobile = mobile;
//       user.city = city;
//       user.state = state;
//       user.pincode = pincode;

//       // set profile image if uploaded
//       if ((req as any).file) {
//         user.profileImage = (req as any).file.path;
//       }

//       user.isVerified = true;
//       user.emailOtp = undefined as any;
//       user.emailOtpExpires = undefined as any;

//       await user.save();

//       const token = signToken(user._id.toString());
//       return res.status(201).json({
//         message: "Registration successful",
//         token,
//         user: { id: user._id, fullName: user.fullName, email: user.email },
//       });
//     } catch (error) {
//       console.error("verifyEmailOtp error:", error);
//       return res.status(500).json({ message: "Server error", error });
//     }
//   },
// ];

import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import {
  loginSchema,
  registerSchema,
  emailOtpSchema,
  verifyOtpSchema,
} from "../../schemas/auth/register.schema.js";
import { AuthService } from "../../services/auth.service.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { uploadProfile } from "../../utils/storage/upload.js";

const authService = new AuthService();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Helper function to sign JWT token
const signToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  } as jwt.SignOptions);
};

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error } = registerSchema.validate(req.body);
    if (error) {
      // Fix: error.details is guaranteed to exist when error exists
      return res.status(400).json({
        message: error.details[0]?.message || "Validation error",
      });
    }

    const profileImage = (req as any).file?.path;
    const result = await authService.register(req.body, profileImage);

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(400).json({ message: error.message || "Server error" });
  }
};

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { error } = loginSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         message: error.details[0]?.message || "Validation error",
//       });
//     }

//     const { email, password } = req.body;
//     const result = await authService.login(email, password);

//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Login error:", error);
//     res.status(400).json({ message: error.message || "Server error" });
//   }
// };

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message || "Validation error",
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first. Check your inbox for OTP.",
        needsVerification: true,
        email: user.email,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = signToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Login successful",
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
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(400).json({ message: error.message || "Server error" });
  }
};

// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // Find user
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate OTP
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     const salt = await bcrypt.genSalt(10);
//     const hashedOtp = await bcrypt.hash(otp, salt);

//     // Save RESET OTP (not email verification OTP)
//     user.resetOtp = hashedOtp;
//     user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
//     user.isResetOtpVerified = false;
//     await user.save();

//     // Send email
//     const html = `
//       <h3>Password Reset Request</h3>
//       <p>Your password reset OTP is: <strong>${otp}</strong></p>
//       <p>This OTP is valid for 10 minutes.</p>
//       <p>If you didn't request a password reset, please ignore this email.</p>
//     `;

//     await sendEmail(user.email, "Password Reset OTP", html);

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent to email",
//       email: user.email,
//     });
//   } catch (error: any) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const result = await authService.resetPassword(email, otp, password);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(400).json({ message: error.message || "Server error" });
  }
};

// export const resetPassword = async (req: Request, res: Response) => {
//   try {
//     const { email, otp, password, confirmPassword } = req.body;

//     if (!email || !otp || !password || !confirmPassword) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // Find user
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify OTP
//     if (!user.resetOtp || !user.resetOtpExpires) {
//       return res.status(400).json({ message: "No OTP request found" });
//     }

//     if (user.resetOtpExpires.getTime() < Date.now()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     const isMatch = await bcrypt.compare(otp, user.resetOtp);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Update password and clear OTP fields
//     user.password = hashedPassword;
//     user.resetOtp = undefined;
//     user.resetOtpExpires = undefined;
//     user.isResetOtpVerified = undefined;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password reset successful",
//     });
//   } catch (error: any) {
//     console.error("Reset password error:", error);
//     res.status(500).json({ message: "Failed to reset password" });
//   }
// };

export const sendEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate email
    const { error } = emailOtpSchema.validate({ email });
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message || "Invalid email",
      });
    }

    // Check if user exists and is verified
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      isVerified: true,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered and verified",
      });
    }

    // Find or create temporary user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create temporary user
      const tempPassword = `Temp@${Math.random().toString(36).slice(2, 10)}`;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      user = await User.create({
        email: email.toLowerCase(),
        fullName: "Temporary User",
        mobile: "0000000000",
        password: hashedPassword,
        isVerified: false,
        emailOtp: undefined,
        emailOtpExpires: undefined,
      });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Save OTP to user
    user.emailOtp = hashedOtp;
    user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email
    const html = `
      <p>Your OTP for email verification is: <strong>${otp}</strong></p>
      <p>Valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(user.email, "Email Verification OTP", html);

    return res.status(200).json({
      message: "OTP sent to email",
      email: user.email,
    });
  } catch (error: any) {
    console.error("sendEmailOtp error:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0]?.message || "Validation error",
      });
    }

    const {
      email,
      otp,
      fullName,
      mobile,
      password,
      confirmPassword,
      city,
      state,
      pincode,
    } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please request OTP again.",
      });
    }

    // Check if user is already verified (prevent duplicate registration)
    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already registered. Please login instead.",
      });
    }

    // Check OTP
    if (!user.emailOtp || !user.emailOtpExpires) {
      return res.status(400).json({
        message: "No OTP request found. Please request OTP again.",
      });
    }

    if (user.emailOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new OTP.",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.emailOtp);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Complete user registration
    user.fullName = fullName;
    user.mobile = mobile;
    user.password = hashedPassword;
    user.city = city || "";
    user.state = state || "";
    user.pincode = pincode || "";

    // Handle profile image if uploaded
    const profileImage = (req as any).file?.path;
    if (profileImage) {
      user.profileImage = profileImage;
    }

    // ✅ Mark as verified and clear OTP
    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

    // ✅ Generate JWT token
    const token = signToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to our platform.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    console.error("verifyEmailOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Middleware wrapper for file upload + verification
export const verifyEmailOtpWithUpload = [
  uploadProfile.single("profile"),
  verifyEmailOtp,
];

// export const verifyResetOtp = async (req: Request, res: Response) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     // Find user
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check reset OTP (you need to add these fields to User model)
//     if (!user.resetOtp || !user.resetOtpExpires) {
//       return res.status(400).json({ message: "No OTP request found" });
//     }

//     if (user.resetOtpExpires.getTime() < Date.now()) {
//       return res.status(400).json({ message: "OTP expired. Please request new OTP." });
//     }

//     const isMatch = await bcrypt.compare(otp, user.resetOtp);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Mark OTP as verified (optional: you can add a field like isResetOtpVerified)
//     user.isResetOtpVerified = true;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//       email: user.email,
//     });
//   } catch (error: any) {
//     console.error("Verify reset OTP error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

