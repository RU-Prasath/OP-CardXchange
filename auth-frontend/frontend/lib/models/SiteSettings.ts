import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  developerCount: number; avgLighthouse: number; contactEmail: string; contactPhone: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  developerCount: { type: Number, default: 10 },
  avgLighthouse: { type: Number, default: 75 },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
