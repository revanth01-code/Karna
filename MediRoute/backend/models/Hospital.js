const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  contact: {
    phone: String,
    emergency: String
  },
  features: {
    totalBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0 },
    totalICU: { type: Number, default: 0 },
    availableICU: { type: Number, default: 0 },
    
    // Doctors
    cardiologist: { type: Boolean, default: false },
    neurologist: { type: Boolean, default: false },
    orthopedic: { type: Boolean, default: false },
    generalSurgeon: { type: Boolean, default: false },
    pediatrician: { type: Boolean, default: false },
    
    // Equipment
    ventilator: { type: Boolean, default: false },
    xray: { type: Boolean, default: false },
    ctScan: { type: Boolean, default: false },
    mri: { type: Boolean, default: false },
    ambulance: { type: Boolean, default: false },
    bloodBank: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);