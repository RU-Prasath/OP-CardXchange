const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    heading: { type: String, required: true },
    subheading: { type: String, default: "" },
    ctaText: { type: String, default: "Explore Our Works" },
    ctaLink: { type: String, default: "/works" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
