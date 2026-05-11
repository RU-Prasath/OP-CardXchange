const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["all", "projects", "interior", "elevation", "construction"],
      default: "all",
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
