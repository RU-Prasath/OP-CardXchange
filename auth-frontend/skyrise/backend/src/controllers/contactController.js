const Contact = require("../models/Contact");
const { sendContactNotification, sendAutoReply } = require("../utils/emailUtils");

exports.submitContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message)
    return res.status(400).json({ success: false, message: "All fields are required" });

  const contact = await Contact.create({ name, email, phone, message });

  try {
    await sendContactNotification({ name, email, phone, message });
    await sendAutoReply({ name, email }, "contact");
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  res.status(201).json({ success: true, message: "Enquiry submitted successfully", contact });
};

exports.getContacts = async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [
    { name: new RegExp(search, "i") },
    { email: new RegExp(search, "i") },
    { phone: new RegExp(search, "i") },
  ];

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit)),
    Contact.countDocuments(filter),
  ]);

  res.json({ success: true, contacts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

exports.updateContactStatus = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, notes: req.body.notes },
    { new: true }
  );
  if (!contact) return res.status(404).json({ success: false, message: "Enquiry not found" });
  res.json({ success: true, contact });
};

exports.deleteContact = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: "Enquiry not found" });
  res.json({ success: true, message: "Enquiry deleted" });
};
