const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, unique: true },
  pricing: {
    bwPerPage: { type: Number },
    colorPerPage: { type: Number },
    perUnit: { type: Number },
    sizes: { type: Map, of: Number }
  },
  isCustom: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
