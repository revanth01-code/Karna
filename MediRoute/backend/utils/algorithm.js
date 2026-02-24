// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * 
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get required doctor based on problem
function getRequiredDoctor(problem) {
  const problemLower = problem.toLowerCase();
  
  if (problemLower.includes('heart') || problemLower.includes('cardiac') || 
      problemLower.includes('chest pain')) {
    return 'cardiologist';
  }
  if (problemLower.includes('brain') || problemLower.includes('stroke') || 
      problemLower.includes('neuro')) {
    return 'neurologist';
  }
  if (problemLower.includes('bone') || problemLower.includes('fracture') || 
      problemLower.includes('accident')) {
    return 'orthopedic';
  }
  if (problemLower.includes('child') || problemLower.includes('baby')) {
    return 'pediatrician';
  }
  return 'generalSurgeon';
}

// Calculate match score
function calculateMatchScore(hospital, patientData) {
  let score = 100;
  const { patientProblem, conditionLevel } = patientData;
  
  // Check required doctor (40 points)
  const requiredDoctor = getRequiredDoctor(patientProblem);
  if (!hospital.features[requiredDoctor]) {
    score -= 40;
  }
  
  // Check bed availability (30 points)
  if (conditionLevel === 'critical' || conditionLevel === 'severe') {
    if (hospital.features.availableICU === 0) {
      score -= 30;
    } else if (hospital.features.availableICU < 2) {
      score -= 15;
    }
  } else {
    if (hospital.features.availableBeds === 0) {
      score -= 30;
    } else if (hospital.features.availableBeds < 3) {
      score -= 15;
    }
  }
  
  // Check equipment (20 points)
  if (!hospital.features.ventilator && (conditionLevel === 'critical')) {
    score -= 10;
  }
  if (!hospital.features.bloodBank) {
    score -= 5;
  }
  if (!hospital.features.ambulance) {
    score -= 5;
  }
  
  // Pulse check (10 points)
  const pulse = patientData.patientPulse;
  if (pulse < 40 || pulse > 140) {
    // Critical pulse - need ICU
    if (hospital.features.availableICU === 0) {
      score -= 10;
    }
  }
  
  return Math.max(score, 0);
}

// Find best hospitals
async function findBestHospitals(hospitals, patientData, ambulanceLocation) {
  const results = [];
  
  for (const hospital of hospitals) {
    const distance = calculateDistance(
      ambulanceLocation.latitude,
      ambulanceLocation.longitude,
      hospital.location.latitude,
      hospital.location.longitude
    );
    
    const eta = Math.ceil(distance * 3); // 3 min per km
    const matchScore = calculateMatchScore(hospital, patientData);
    const requiredDoctor = getRequiredDoctor(patientData.patientProblem);
    
    results.push({
      hospitalId: hospital._id,
      hospitalName: hospital.name,
      hospitalAddress: hospital.location.address,
      hospitalPhone: hospital.contact.phone,
      distance: Math.round(distance * 10) / 10,
      eta,
      matchScore,
      availableBeds: hospital.features.availableBeds,
      availableICU: hospital.features.availableICU,
      hasRequiredDoctor: hospital.features[requiredDoctor],
      requiredDoctor,
      location: hospital.location
    });
  }
  
  // Sort by match score + distance
  results.sort((a, b) => {
    const scoreA = a.matchScore * 0.7 + ((20 - a.distance) / 20 * 30);
    const scoreB = b.matchScore * 0.7 + ((20 - b.distance) / 20 * 30);
    return scoreB - scoreA;
  });
  
  return results.slice(0, 5); // Top 5
}

module.exports = {
  calculateDistance,
  findBestHospitals,
  getRequiredDoctor
};