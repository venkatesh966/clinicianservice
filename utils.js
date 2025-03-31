// utils.js


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

function calDistance(coord1, coord2) {
    const toRad = value => (value * Math.PI) / 180;
    const lat1 = coord1.lat;
    const lon1 = coord1.lon;
    const lat2 = coord2.lat;
    const lon2 = coord2.lon;
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371000 * c; 
  }
  
 
  function isWithinSafeZone(coordinate, safeZoneCenter, safeZoneRadius) {
    const distance = calDistance(coordinate, safeZoneCenter);
    console.log(`Distance from safe zone center: ${distance.toFixed(2)} meters`);
    return distance < safeZoneRadius;
  }
  

  function extractCoordinate(geojson) {
    if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) {
      const pointFeature = geojson.features.find(
        feature => feature.geometry && feature.geometry.type === "Point"
      );
      if (pointFeature && Array.isArray(pointFeature.geometry.coordinates)) {
        const coords = pointFeature.geometry.coordinates;
        return { lat: coords[1], lon: coords[0] };
      }
    } else if (geojson.type === "Feature" && geojson.geometry && geojson.geometry.type === "Point") {
      const coords = geojson.geometry.coordinates;
      if (Array.isArray(coords) && coords.length >= 2) {
        return { lat: coords[1], lon: coords[0] };
      }
    }
    console.error("Could not extract point coordinate from geojson:", geojson);
    return null;
  }
  
  module.exports = { sleep, calDistance, isWithinSafeZone, extractCoordinate };
  