// monitor.js
const { CLINICIAN_IDS, ALERT_THRESHOLD_SECONDS, POLLING_INTERVAL_SECONDS, SAFE_ZONE_RADIUS_METERS } = require('./config');
const { fetchClinicianStatus } = require('./fetchservice');
const { extractCoordinate, isWithinSafeZone, sleep } = require('./utils');
const { sendEmailAlert } = require('./emailservice');

const clinicianState = {};
CLINICIAN_IDS.forEach(id => {
  clinicianState[id] = { safeZoneCenter: null, outOfZoneSince: null, alertSent: false };
});

async function monitorClinicians() {
  console.log("Starting clinician monitoring service...");

  while (true) {
    const now = new Date();
    for (const clinicianId of CLINICIAN_IDS) {
      const data = await fetchClinicianStatus(clinicianId);
      if (!data) {
        console.warn(`Skipping clinician ${clinicianId} due to API failure.`);
        continue;
      }

      const coordinate = extractCoordinate(data);
      if (!coordinate) {
        console.error(`Invalid coordinate data for clinician ${clinicianId}`);
        continue;
      }

      const state = clinicianState[clinicianId];
      if (!state.safeZoneCenter) {
        state.safeZoneCenter = coordinate;
        console.log(`Setting safe zone center for clinician ${clinicianId} at ${JSON.stringify(coordinate)}`);
      }

      const inZone = isWithinSafeZone(coordinate, state.safeZoneCenter, SAFE_ZONE_RADIUS_METERS);

      if (inZone) {
        if (state.outOfZoneSince) {
          console.log(`Clinician ${clinicianId} returned to safe zone at ${now.toISOString()}.`);
        }
        state.outOfZoneSince = null;
        state.alertSent = false;
      } else {
        if (!state.outOfZoneSince) {
          state.outOfZoneSince = now;
          console.log(`Clinician ${clinicianId} went out-of-zone at ${now.toISOString()}.`);
        } else {
          const duration = (now - state.outOfZoneSince) / 1000;
          console.log(`Clinician ${clinicianId} has been out-of-zone for ${duration.toFixed(0)} seconds.`);
          if (duration >= ALERT_THRESHOLD_SECONDS && !state.alertSent) {
            const emailSent = await sendEmailAlert(clinicianId, ALERT_THRESHOLD_SECONDS);
            if (emailSent) {
              state.alertSent = true;
            }
          }
        }
      }
    }
    await sleep(POLLING_INTERVAL_SECONDS * 1000);
  }
}

module.exports = { monitorClinicians };
