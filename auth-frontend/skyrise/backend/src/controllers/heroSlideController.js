const HeroSlide = require("../models/HeroSlide");
const { deleteFile } = require("../middleware/upload");

exports.getSlides = async (req, res) => {
  const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, slides });
};

exports.getAllSlides = async (req, res) => {
  const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, slides });
};

exports.createSlide = async (req, res) => {
  const { heading, subheading, ctaText, ctaLink, order, active } = req.body;
  const image = req.file ? `/uploads/hero/${req.file.filename}` : "";
  const slide = await HeroSlide.create({ image, heading, subheading, ctaText, ctaLink, order: order || 0, active: active !== "false" });
  res.status(201).json({ success: true, slide });
};

exports.updateSlide = async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ success: false, message: "Slide not found" });

  if (req.file) {
    if (slide.image) deleteFile(slide.image);
    slide.image = `/uploads/hero/${req.file.filename}`;
  }

  const { heading, subheading, ctaText, ctaLink, order, active } = req.body;
  if (heading !== undefined) slide.heading = heading;
  if (subheading !== undefined) slide.subheading = subheading;
  if (ctaText !== undefined) slide.ctaText = ctaText;
  if (ctaLink !== undefined) slide.ctaLink = ctaLink;
  if (order !== undefined) slide.order = order;
  if (active !== undefined) slide.active = active !== "false";

  await slide.save();
  res.json({ success: true, slide });
};

exports.deleteSlide = async (req, res) => {
  const slide = await HeroSlide.findByIdAndDelete(req.params.id);
  if (!slide) return res.status(404).json({ success: false, message: "Slide not found" });
  if (slide.image) deleteFile(slide.image);
  res.json({ success: true, message: "Slide deleted" });
};
