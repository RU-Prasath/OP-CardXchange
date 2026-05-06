import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  isSuperAdmin: boolean;
  permissions: {
    visibleScreens: string[];
    editableSections: string[];
  };
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isSuperAdmin: { type: Boolean, default: false },
    permissions: {
      visibleScreens: {
        type: [String],
        default: ['hero', 'about', 'projects', 'experience', 'skills', 'colors', 'contact'],
      },
      editableSections: {
        type: [String],
        default: [],
      },
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { timestamps: false }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
