const Lead = require("../models/Lead");
const { sendLeadNotification, sendAutoReply } = require("../utils/emailUtils");

exports.submitLead = async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone)
    return res.status(400).json({ success: false, message: "All fields are required" });

  const lead = await Lead.create({ name, email, phone, source: "popup" });

  try {
    await sendLeadNotification({ name, email, phone });
    await sendAutoReply({ name, email }, "lead");
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  res.status(201).json({ success: true, message: "Thank you! We will contact you soon.", lead });
};

exports.getLeads = async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [
    { name: new RegExp(search, "i") },
    { email: new RegExp(search, "i") },
    { phone: new RegExp(search, "i") },
  ];

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
    Lead.countDocuments(filter),
  ]);

  res.json({ success: true, leads, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

exports.updateLeadStatus = async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, notes: req.body.notes },
    { new: true }
  );
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  res.json({ success: true, lead });
};

exports.deleteLead = async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Lead deleted" });
};

exports.exportLeads = async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  const csv = [
    "Name,Email,Phone,Status,Source,Date",
    ...leads.map((l) =>
      `"${l.name}","${l.email}","${l.phone}","${l.status}","${l.source}","${l.createdAt.toLocaleDateString()}"`
    ),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.send(csv);
};
