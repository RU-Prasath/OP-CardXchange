const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Lead = require("../models/Lead");
const Contact = require("../models/Contact");
const Project = require("../models/Project");
const mongoose = require("mongoose");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required" });

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password)))
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  if (!admin.isActive)
    return res.status(403).json({ success: false, message: "Account disabled" });

  admin.lastLogin = new Date();
  await admin.save();

  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
};

exports.getProfile = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    { name, email },
    { new: true, select: "-password" }
  );
  res.json({ success: true, admin });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id);
  if (!(await admin.matchPassword(currentPassword)))
    return res.status(400).json({ success: false, message: "Current password incorrect" });

  admin.password = newPassword;
  await admin.save();
  res.json({ success: true, message: "Password changed successfully" });
};

exports.getDashboardStats = async (req, res) => {
  const [totalLeads, totalEnquiries, totalProjects, recentLeads, recentEnquiries] =
    await Promise.all([
      Lead.countDocuments(),
      Contact.countDocuments(),
      Project.countDocuments({ isActive: true }),
      Lead.find().sort({ createdAt: -1 }).limit(5),
      Contact.find().sort({ createdAt: -1 }).limit(5),
    ]);

  const newLeads = await Lead.countDocuments({ status: "new" });
  const newEnquiries = await Contact.countDocuments({ status: "new" });

  res.json({
    success: true,
    stats: { totalLeads, totalEnquiries, totalProjects, newLeads, newEnquiries },
    recentLeads,
    recentEnquiries,
  });
};

exports.createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: "Admin already exists" });

  const admin = await Admin.create({ name, email, password, role });
  res.status(201).json({
    success: true,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
};

exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, admins });
};

exports.getDbStats = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    if (!db) return res.status(500).json({ success: false, message: "No DB connection" });

    const stats = await db.command({ dbStats: 1, scale: 1 });
    res.json({
      success: true,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexSize: stats.indexSize,
      totalSize: stats.dataSize + stats.indexSize,
      collections: stats.collections,
      objects: stats.objects,
    });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch DB stats" });
  }
};
