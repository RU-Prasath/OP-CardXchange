import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  quote: string; name: string; role: string; gradient: string; order: number; isVisible: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  role: String,
  gradient: { type: String, default: 'from-cyan-400 to-indigo-500' },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
