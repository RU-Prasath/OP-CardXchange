const Testimonial = require("../models/Testimonial");
const { deleteFile } = require("../middleware/upload");

exports.getTestimonials = async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, testimonials });
};

exports.createTestimonial = async (req, res) => {
  const { name, designation, location, message, rating, order } = req.body;
  const image = req.file ? `/uploads/testimonials/${req.file.filename}` : null;
  const t = await Testimonial.create({ name, designation, location, message, rating: rating || 5, order: order || 0, image });
  res.status(201).json({ success: true, testimonial: t });
};

exports.updateTestimonial = async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) return res.status(404).json({ success: false, message: "Not found" });

  if (req.file) {
    deleteFile(t.image);
    t.image = `/uploads/testimonials/${req.file.filename}`;
  }
  const { name, designation, location, message, rating, order, isActive } = req.body;
  Object.assign(t, { name: name || t.name, designation: designation ?? t.designation, location: location ?? t.location, message: message || t.message, rating: rating || t.rating, order: order !== undefined ? parseInt(order) : t.order, isActive: isActive !== undefined ? isActive === "true" : t.isActive });
  await t.save();
  res.json({ success: true, testimonial: t });
};

exports.deleteTestimonial = async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) return res.status(404).json({ success: false, message: "Not found" });
  deleteFile(t.image);
  await t.deleteOne();
  res.json({ success: true, message: "Testimonial deleted" });
};
