import mongoose, { Schema, Document } from "mongoose";

export interface IOPCard extends Document {
  name: string;
  category?: string;
  condition?: string;
  images: string[];
  description?: string;
  price: number;
  status: "pending"|"approved"|"rejected";
  seller?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OPCardSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String },
  condition: { type: String },
  images: [{ type: String }],
  description: { type: String },
  price: { type: Number, required: true },
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model<IOPCard>("OPCard", OPCardSchema);