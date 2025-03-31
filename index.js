// index.js
const { monitorClinicians } = require('./monitor');

monitorClinicians().catch(error => {
  console.error("Unexpected error in monitoring service:", error);
});
