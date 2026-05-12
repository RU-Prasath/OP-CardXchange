import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  slug: string;
  category: 'developer' | 'designer' | 'photographer' | 'writer' | 'minimal';
  thumbnail: string;
  isPublished: boolean;
  pricingType: 'free' | 'paid';
  monthlyPrice: number;
  yearlyPrice: number;
  frontendPath: string;
  adminConfig: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      enum: ['developer', 'designer', 'photographer', 'writer', 'minimal'],
      required: true,
    },
    thumbnail: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    pricingType: { type: String, enum: ['free', 'paid'], default: 'free' },
    monthlyPrice: { type: Number, default: 0 },
    yearlyPrice: { type: Number, default: 0 },
    frontendPath: { type: String, required: true },
    adminConfig: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Clear cached model in dev so schema changes take effect without full restart
if (process.env.NODE_ENV !== 'production' && mongoose.models['Template']) {
  delete (mongoose.models as Record<string, unknown>)['Template'];
}

const Template: Model<ITemplate> =
  (mongoose.models.Template as Model<ITemplate>) ||
  mongoose.model<ITemplate>('Template', TemplateSchema);

export default Template;
