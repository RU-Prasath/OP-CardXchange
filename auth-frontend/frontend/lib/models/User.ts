import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  role: 'superadmin' | 'user';
  allocatedTemplate: Types.ObjectId | null;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
    role: { type: String, enum: ['superadmin', 'user'], default: 'user' },
    allocatedTemplate: { type: Schema.Types.ObjectId, ref: 'Template', default: null },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
