import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  profileImage?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  pincode?: string | undefined;
  resetOtp?: string | undefined;
  resetOtpExpires?: Date | undefined;
  emailOtp?: string | undefined;
  emailOtpExpires?: Date | undefined;
  isVerified?: boolean | undefined;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    emailOtp: { type: String },
    emailOtpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
