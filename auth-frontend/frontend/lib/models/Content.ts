import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContent extends Document {
  section: string;
  userEmail: string;
  data: Record<string, unknown>;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    section: { type: String, required: true },
    userEmail: { type: String, required: true, default: '' }, // '' = super admin
    data: { type: Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Compound unique index: one section per user
ContentSchema.index({ section: 1, userEmail: 1 }, { unique: true });

ContentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Content: Model<IContent> =
  (mongoose.models.Content as Model<IContent>) ||
  mongoose.model<IContent>('Content', ContentSchema);

export default Content;
