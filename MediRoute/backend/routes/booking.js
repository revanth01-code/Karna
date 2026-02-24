const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hospital = require('../models/Hospital');
const protect = require('../middleware/auth');
const { findBestHospitals } = require('../utils/algorithm');

// Find best hospitals
router.post('/find-hospitals', protect, async (req, res) => {
  try {
    const { patientData, ambulanceLocation } = req.body;
    
    const hospitals = await Hospital.find({
      status: 'active',
      $or: [
        { 'features.availableBeds': { $gt: 0 } },
        { 'features.availableICU': { $gt: 0 } }
      ]
    });
    
    const results = await findBestHospitals(hospitals, patientData, ambulanceLocation);
    
    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Find hospitals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    
    const populated = await Booking.findById(booking._id).populate('hospitalId');
    
    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings for ambulance
router.get('/ambulance/:ambulanceId', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      ambulanceId: req.params.ambulanceId,
      status: { $in: ['pending', 'accepted', 'in-progress'] }
    }).populate('hospitalId').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings for hospital
router.get('/hospital/:hospitalId', protect, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { hospitalId: req.params.hospitalId };
    if (status) {
      query.status = status;
    }
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status
router.put('/:id', protect, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (updates.status === 'accepted') {
      updates.acceptedAt = new Date();
    } else if (updates.status === 'completed') {
      updates.completedAt = new Date();
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('hospitalId');
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;