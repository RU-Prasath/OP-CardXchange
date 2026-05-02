const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  label: { type: String, required: true },
  serviceType: { type: String, required: true }, // must match a Service.type
  pages: { type: Number },
  copies: { type: Number },
  printType: { type: String }, // 'BW' or 'Color'
  quantity: { type: Number },
  size: { type: String },
  order: { type: Number, default: 0 }, // display order
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Preset', presetSchema);
