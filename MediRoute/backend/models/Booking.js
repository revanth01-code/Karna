const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Patient Info
  patientName: {
    type: String,
    required: true
  },
  patientProblem: {
    type: String,
    required: true
  },
  patientPulse: {
    type: Number,
    required: true
  },
  conditionLevel: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'critical'],
    required: true
  },
  
  // Ambulance Info
  ambulanceId: {
    type: String,
    required: true
  },
  driverName: String,
  driverPhone: String,
  
  // Hospital Info
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  hospitalName: String,
  
  // Location
  pickupLocation: {
    latitude: Number,
    longitude: Number
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps
  bookedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  completedAt: Date
  
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);