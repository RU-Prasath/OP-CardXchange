import type { IUser } from "../models/User.js";
import User from "../models/User.js";

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select("-password -resetOtp -emailOtp -resetOtpExpires -emailOtpExpires");
  }

  async findAll(): Promise<IUser[]> {
    return User.find().select("-password -resetOtp -emailOtp -resetOtpExpires -emailOtpExpires");
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }
}