const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Hospital = require('./models/Hospital');
const User = require('./models/User');

dotenv.config();

const hospitals = [
  {
    name: "City General Hospital",
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: "Connaught Place, Delhi"
    },
    contact: {
      phone: "+91-11-12345678",
      emergency: "+91-11-12345679"
    },
    features: {
      totalBeds: 200,
      availableBeds: 45,
      totalICU: 20,
      availableICU: 4,
      cardiologist: true,
      neurologist: false,
      orthopedic: true,
      generalSurgeon: true,
      pediatrician: true,
      ventilator: true,
      xray: true,
      ctScan: true,
      mri: true,
      ambulance: true,
      bloodBank: true
    }
  },
  {
    name: "Metro Medical Center",
    location: {
      latitude: 28.5355,
      longitude: 77.3910,
      address: "Sector 18, Noida"
    },
    contact: {
      phone: "+91-120-98765432",
      emergency: "+91-120-98765433"
    },
    features: {
      totalBeds: 150,
      availableBeds: 30,
      totalICU: 15,
      availableICU: 1,
      cardiologist: false,
      neurologist: true,
      orthopedic: true,
      generalSurgeon: true,
      pediatrician: false,
      ventilator: true,
      xray: true,
      ctScan: true,
      mri: false,
      ambulance: true,
      bloodBank: true
    }
  },
  {
    name: "Care Hospital",
    location: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: "Rohini, Delhi"
    },
    contact: {
      phone: "+91-11-87654321",
      emergency: "+91-11-87654322"
    },
    features: {
      totalBeds: 100,
      availableBeds: 20,
      totalICU: 10,
      availableICU: 2,
      cardiologist: true,
      neurologist: true,
      orthopedic: false,
      generalSurgeon: true,
      pediatrician: true,
      ventilator: true,
      xray: true,
      ctScan: false,
      mri: false,
      ambulance: true,
      bloodBank: true
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');
    
    await Hospital.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared data');
    
    const insertedHospitals = await Hospital.insertMany(hospitals);
    console.log('Seeded hospitals');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const users = [
      {
        name: "Ambulance Driver",
        email: "ambulance@demo.com",
        password: hashedPassword,
        role: "ambulance",
        ambulanceId: "AMB-001",
        phone: "+91-9876543210"
      },
      {
        name: "City Hospital Staff",
        email: "hospital1@demo.com",
        password: hashedPassword,
        role: "hospital",
        hospitalId: insertedHospitals[0]._id,
        phone: "+91-9876543211"
      },
      {
        name: "Metro Hospital Staff",
        email: "hospital2@demo.com",
        password: hashedPassword,
        role: "hospital",
        hospitalId: insertedHospitals[1]._id,
        phone: "+91-9876543212"
      }
    ];
    
    await User.insertMany(users);
    console.log('Seeded users');
    
    console.log('\nSEEDING COMPLETE!');
    console.log('\nDemo Credentials:');
    console.log('Ambulance: ambulance@demo.com / password123');
    console.log('Hospital: hospital1@demo.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDB();