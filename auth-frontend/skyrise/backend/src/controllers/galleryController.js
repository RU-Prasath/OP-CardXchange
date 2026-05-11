const Gallery = require("../models/Gallery");
const { deleteFile } = require("../middleware/upload");

exports.getGallery = async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category && category !== "all") filter.category = category;
  const gallery = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, gallery });
};

exports.addGalleryItem = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Image required" });
  const { title, category, order } = req.body;
  const image = `/uploads/gallery/${req.file.filename}`;
  const item = await Gallery.create({ title, image, category: category || "all", order: order || 0 });
  res.status(201).json({ success: true, item });
};

exports.updateGalleryItem = async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  if (req.file) {
    deleteFile(item.image);
    item.image = `/uploads/gallery/${req.file.filename}`;
  }
  const { title, category, order, isActive } = req.body;
  Object.assign(item, { title: title ?? item.title, category: category || item.category, order: order !== undefined ? parseInt(order) : item.order, isActive: isActive !== undefined ? isActive === "true" : item.isActive });
  await item.save();
  res.json({ success: true, item });
};

exports.deleteGalleryItem = async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  deleteFile(item.image);
  await item.deleteOne();
  res.json({ success: true, message: "Gallery item deleted" });
};
