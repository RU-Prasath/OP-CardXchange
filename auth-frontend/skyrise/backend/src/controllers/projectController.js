const path = require("path");
const Project = require("../models/Project");
const { deleteFile } = require("../middleware/upload");

const getImagePath = (file) => file ? `/uploads/projects/${file.filename}` : null;

exports.getProjects = async (req, res) => {
  const { category, featured, limit } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;

  let query = Project.find(filter).sort({ order: 1, createdAt: -1 });
  if (limit) query = query.limit(parseInt(limit));

  const projects = await query;
  res.json({ success: true, projects });
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  res.json({ success: true, project });
};

exports.createProject = async (req, res) => {
  const { title, description, category, location, area, year, client, tags, featured, order } = req.body;

  const coverImage = req.files?.coverImage?.[0]
    ? `/uploads/projects/${req.files.coverImage[0].filename}`
    : null;
  const images = req.files?.images
    ? req.files.images.map((f) => `/uploads/projects/${f.filename}`)
    : [];

  const project = await Project.create({
    title, description, category, location, area, year, client,
    tags: tags ? JSON.parse(tags) : [],
    featured: featured === "true",
    order: order || 0,
    coverImage,
    images,
  });

  res.status(201).json({ success: true, project });
};

exports.updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  const { title, description, category, location, area, year, client, tags, featured, order } = req.body;

  if (req.files?.coverImage?.[0]) {
    deleteFile(project.coverImage);
    project.coverImage = `/uploads/projects/${req.files.coverImage[0].filename}`;
  }

  if (req.files?.images?.length) {
    project.images.forEach((img) => deleteFile(img));
    project.images = req.files.images.map((f) => `/uploads/projects/${f.filename}`);
  }

  Object.assign(project, {
    title: title || project.title,
    description: description ?? project.description,
    category: category || project.category,
    location: location ?? project.location,
    area: area ?? project.area,
    year: year ?? project.year,
    client: client ?? project.client,
    tags: tags ? JSON.parse(tags) : project.tags,
    featured: featured !== undefined ? featured === "true" : project.featured,
    order: order !== undefined ? parseInt(order) : project.order,
  });

  await project.save();
  res.json({ success: true, project });
};

exports.deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  deleteFile(project.coverImage);
  project.images.forEach((img) => deleteFile(img));

  await project.deleteOne();
  res.json({ success: true, message: "Project deleted" });
};
