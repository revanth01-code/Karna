const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const protect = require('../middleware/auth');

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: 'active' });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single hospital
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update hospital features
router.put('/:id/features', protect, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { 
        features: req.body.features,
        lastUpdated: new Date()
      },
      { new: true }
    );
    
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;