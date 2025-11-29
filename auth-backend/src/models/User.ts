import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    mobile: string;
    email: string;
    password: string;
    profileImage?: string;
    gender?: string;
    city?: string;
    state?: string;
    pincode?: string;
    resetOtp?: string;
    resetOtpExpires?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    gender: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    resetOtp: { type: String },
    resetOtpExpires: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);