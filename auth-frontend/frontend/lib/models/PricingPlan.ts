import mongoose, { Schema, Document } from 'mongoose';

export interface IFeature { text: string; highlighted: boolean; missing: boolean; }
export interface IPricingPlan extends Document {
  tier: string; desc: string; monthlyPrice: number; yearlyPrice: number;
  billNote: string; cta: string; isFeatured: boolean;
  features: IFeature[]; order: number; isVisible: boolean;
}

const PricingPlanSchema = new Schema<IPricingPlan>({
  tier: { type: String, required: true },
  desc: String,
  monthlyPrice: { type: Number, default: 0 },
  yearlyPrice: { type: Number, default: 0 },
  billNote: String,
  cta: String,
  isFeatured: { type: Boolean, default: false },
  features: [{ text: String, highlighted: { type: Boolean, default: false }, missing: { type: Boolean, default: false } }],
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.PricingPlan || mongoose.model<IPricingPlan>('PricingPlan', PricingPlanSchema);
