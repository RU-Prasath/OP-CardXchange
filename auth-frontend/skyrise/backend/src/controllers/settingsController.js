const Settings = require("../models/Settings");
const { deleteFile } = require("../middleware/upload");

exports.getSettings = async (req, res) => {
  const settings = await Settings.find();
  const map = {};
  settings.forEach((s) => (map[s.key] = s.value));
  res.json({ success: true, settings: map });
};

exports.getSettingsByGroup = async (req, res) => {
  const settings = await Settings.find({ group: req.params.group });
  const map = {};
  settings.forEach((s) => (map[s.key] = s.value));
  res.json({ success: true, settings: map });
};

exports.updateSetting = async (req, res) => {
  const { key, value, group, label } = req.body;
  const setting = await Settings.findOneAndUpdate(
    { key },
    { value, group: group || "general", label },
    { new: true, upsert: true }
  );
  res.json({ success: true, setting });
};

exports.updateSettingsBulk = async (req, res) => {
  const { settings } = req.body; // array of { key, value, group, label }
  const ops = settings.map((s) => ({
    updateOne: {
      filter: { key: s.key },
      update: { $set: { value: s.value, group: s.group || "general", label: s.label } },
      upsert: true,
    },
  }));
  await Settings.bulkWrite(ops);
  res.json({ success: true, message: "Settings updated" });
};

exports.uploadLogo = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file" });

  const existing = await Settings.findOne({ key: "site_logo" });
  if (existing?.value) deleteFile(existing.value);

  const logoPath = `/uploads/hero/${req.file.filename}`;
  await Settings.findOneAndUpdate({ key: "site_logo" }, { value: logoPath, group: "branding" }, { upsert: true });
  res.json({ success: true, logo: logoPath });
};
