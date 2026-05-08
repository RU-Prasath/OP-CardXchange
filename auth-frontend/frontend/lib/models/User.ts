import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  phone: string;
  role: 'superadmin' | 'user';
  allocatedTemplate: Types.ObjectId | null;
  isActive: boolean;
  plan: 'free' | 'paid';
  planBilling: 'monthly' | 'yearly';
  planStartDate: Date | null;
  pricingPlanId: Types.ObjectId | null;
  paidAmount: number;
  createdAt: Date;
  lastLogin: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['superadmin', 'user'], default: 'user' },
    allocatedTemplate: { type: Schema.Types.ObjectId, ref: 'Template', default: null },
    isActive: { type: Boolean, default: true },
    plan: { type: String, enum: ['free', 'paid'], default: 'free' },
    planBilling: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    planStartDate: { type: Date, default: null },
    pricingPlanId: { type: Schema.Types.ObjectId, ref: 'PricingPlan', default: null },
    paidAmount: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
