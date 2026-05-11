const Service = require("../models/Service");
const { deleteFile } = require("../middleware/upload");

exports.getServices = async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, services });
};

exports.getServiceBySlug = async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!service) return res.status(404).json({ success: false, message: "Service not found" });
  res.json({ success: true, service });
};

exports.createService = async (req, res) => {
  const { title, shortDescription, description, features, icon, order } = req.body;
  const image = req.files?.image?.[0] ? `/uploads/services/${req.files.image[0].filename}` : null;
  const heroImage = req.files?.heroImage?.[0] ? `/uploads/services/${req.files.heroImage[0].filename}` : null;

  const service = await Service.create({
    title, shortDescription, description,
    features: features ? JSON.parse(features) : [],
    icon, order: order || 0, image, heroImage,
  });
  res.status(201).json({ success: true, service });
};

exports.updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: "Service not found" });

  const { title, shortDescription, description, features, icon, order, isActive } = req.body;

  if (req.files?.image?.[0]) {
    deleteFile(service.image);
    service.image = `/uploads/services/${req.files.image[0].filename}`;
  }
  if (req.files?.heroImage?.[0]) {
    deleteFile(service.heroImage);
    service.heroImage = `/uploads/services/${req.files.heroImage[0].filename}`;
  }

  Object.assign(service, {
    title: title || service.title,
    shortDescription: shortDescription ?? service.shortDescription,
    description: description ?? service.description,
    features: features ? JSON.parse(features) : service.features,
    icon: icon ?? service.icon,
    order: order !== undefined ? parseInt(order) : service.order,
    isActive: isActive !== undefined ? isActive === "true" : service.isActive,
  });

  await service.save();
  res.json({ success: true, service });
};

exports.deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: "Service not found" });

  deleteFile(service.image);
  deleteFile(service.heroImage);
  await service.deleteOne();
  res.json({ success: true, message: "Service deleted" });
};
