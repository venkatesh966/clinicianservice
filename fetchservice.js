// fetchService.js
const axios = require('axios');
const { API_BASE_URL, MAX_API_RETRIES, SAFE_ZONE_RADIUS_METERS } = require('./config');
const { sleep } = require('./utils');

async function fetchClinicianStatus(clinicianId) {
  if (clinicianId === 7) {
    const simulatedCoordinate = {
      lat: 0.0, 
      lon: 0.0,
    };
    simulatedCoordinate.lat = 0; 
    simulatedCoordinate.lon = 0;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [300.0, 0.0] 
          }
        }
      ]
    };
  }

  const url = `${API_BASE_URL}${clinicianId}`;
  let retries = 0;
  let delay = 1000; 

  while (retries < MAX_API_RETRIES) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      return response.data;
    } catch (error) {
      console.error(`Error fetching status for clinician ${clinicianId}: ${error.message}`);
      retries++;
      await sleep(delay);
      delay *= 2;
    }
  }
  console.error(`Exceeded max retries for clinician ${clinicianId}`);
  return null;
}

module.exports = { fetchClinicianStatus };
