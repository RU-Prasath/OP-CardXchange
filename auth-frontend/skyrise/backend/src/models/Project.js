const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["completed", "ongoing", "interior", "elevation"],
      required: true,
    },
    location: { type: String },
    area: { type: String },
    year: { type: String },
    client: { type: String },
    coverImage: { type: String },
    images: [{ type: String }],
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
