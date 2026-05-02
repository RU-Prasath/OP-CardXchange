const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Get all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create service (admin)
router.post('/', auth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Update service pricing (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete service (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Seed default services
router.post('/seed', auth, async (req, res) => {
  try {
    await Service.deleteMany({});
    const defaults = [
      { name: 'Xerox', type: 'xerox', pricing: { bwPerPage: 1.5, colorPerPage: 5 } },
      { name: 'Spiral Binding', type: 'spiral', pricing: { sizes: { A4: 30, A3: 50, Letter: 25 } } },
      { name: 'ID Card', type: 'idcard', pricing: { perUnit: 50 } },
      { name: 'Brochure', type: 'brochure', pricing: { bwPerPage: 3, colorPerPage: 8 } },
      { name: 'Offset Printing', type: 'offset', pricing: { bwPerPage: 2, colorPerPage: 6 } },
      { name: 'Lamination', type: 'lamination', pricing: { sizes: { A4: 20, A3: 35, 'ID Card': 10 } } }
    ];
    await Service.insertMany(defaults);
    res.json({ message: 'Seeded' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
