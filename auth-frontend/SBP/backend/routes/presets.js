const express = require('express');
const router = express.Router();
const Preset = require('../models/Preset');
const auth = require('../middleware/auth');

// Public: get all presets (frontend uses this)
router.get('/', async (req, res) => {
  try {
    const presets = await Preset.find().sort('order createdAt');
    res.json(presets);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: create preset
router.post('/', auth, async (req, res) => {
  try {
    const preset = new Preset(req.body);
    await preset.save();
    res.status(201).json(preset);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: delete preset
router.delete('/:id', auth, async (req, res) => {
  try {
    await Preset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
