const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  service: { type: String, required: true },
  serviceType: { type: String }, // 'xerox', 'spiral', 'idcard', 'brochure', 'offset', 'custom'
  pages: { type: Number },
  copies: { type: Number },
  printType: { type: String }, // 'BW' or 'Color'
  quantity: { type: Number },
  size: { type: String },
  binding: { type: Boolean, default: false },
  lamination: { type: Boolean, default: false },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  description: { type: String }
});

module.exports = mongoose.model('Order', orderSchema);
