import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../../../models/User.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select(
      "-password -resetOtp -emailOtp -resetOtpExpires -emailOtpExpires"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById().select(
      "-password -resetOtp -emailOtp -resetOtpExpires -emailOtpExpires"
    );

    if (!user) {
      return res.json(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
