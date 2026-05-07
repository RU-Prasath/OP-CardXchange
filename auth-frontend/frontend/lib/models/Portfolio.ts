import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPortfolio extends Document {
  user: Types.ObjectId;
  template: Types.ObjectId;
  content: Record<string, unknown>;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    template: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
    content: { type: Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Portfolio: Model<IPortfolio> =
  (mongoose.models.Portfolio as Model<IPortfolio>) ||
  mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
