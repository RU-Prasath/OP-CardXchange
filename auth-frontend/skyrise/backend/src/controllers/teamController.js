const Team = require("../models/Team");
const { deleteFile } = require("../middleware/upload");

exports.getTeam = async (req, res) => {
  const team = await Team.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, team });
};

exports.createTeamMember = async (req, res) => {
  const { name, designation, bio, linkedin, order } = req.body;
  const image = req.file ? `/uploads/team/${req.file.filename}` : null;
  const member = await Team.create({ name, designation, bio, linkedin, order: order || 0, image });
  res.status(201).json({ success: true, member });
};

exports.updateTeamMember = async (req, res) => {
  const member = await Team.findById(req.params.id);
  if (!member) return res.status(404).json({ success: false, message: "Member not found" });

  if (req.file) {
    deleteFile(member.image);
    member.image = `/uploads/team/${req.file.filename}`;
  }
  const { name, designation, bio, linkedin, order, isActive } = req.body;
  Object.assign(member, { name: name || member.name, designation: designation || member.designation, bio: bio ?? member.bio, linkedin: linkedin ?? member.linkedin, order: order !== undefined ? parseInt(order) : member.order, isActive: isActive !== undefined ? isActive === "true" : member.isActive });
  await member.save();
  res.json({ success: true, member });
};

exports.deleteTeamMember = async (req, res) => {
  const member = await Team.findById(req.params.id);
  if (!member) return res.status(404).json({ success: false, message: "Member not found" });
  deleteFile(member.image);
  await member.deleteOne();
  res.json({ success: true, message: "Member deleted" });
};
