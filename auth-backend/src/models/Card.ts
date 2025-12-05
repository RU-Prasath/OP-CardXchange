import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
  name: string;
  category?: string;
  condition?: string;
  images: string[]; // stored paths
  description?: string;
  status: "pending"|"approved"|"rejected";
  seller?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String },
  condition: { type: String },
  images: [{ type: String }], // array of file paths
  description: { type: String },
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model<ICard>("Card", CardSchema);
