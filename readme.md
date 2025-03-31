# Clinician Monitoring Service

This project is a security feature for Clinician Service. It monitors phlebotomists' (clinicians') locations in real time and sends an email alert if a clinician leaves the safe zone (around a patient's home) for more than 5 minutes.

## Overview

When a clinician visits a patient's home, the system sets that location as their safe zone center. It then checks every 30 seconds to see if they remain within a set radius (default: 50 meters) for testing purpose. If they are out-of-zone for over 5 minutes, an email alert is sent. 

## Features

- **Dynamic Safe Zone:**  
  The safe zone is based on the clinician’s first valid location at a patient’s home.

- **Continuous Monitoring:**  
  The system polls the clinician status API every 30 seconds for updated location data.

- **Alerting:**  
  If a clinician is outside the safe zone for more than 5 minutes, an email alert is sent.


## Architecture

The project is divided into these modules:

- **config.js:**  
  Stores configuration parameters like API URL, clinician IDs, safe zone radius, alert time, polling interval, and SMTP settings.

- **utils.js:**  
  Contains helper functions:
  - `sleep()` pauses the program.
  - `calDistance()` (or equivalent) calculates the distance between two coordinates.
  - `isWithinSafeZone()` checks if a coordinate is within the safe zone.
  - `extractCoordinate()` pulls the clinician's location from a GeoJSON response.

- **emailService.js:**  
  Using Nodemailer to send email alerts and handles retry logic.

- **fetchService.js:**  
  Calls the clinician status API.

- **monitor.js:**  
  The main loop that:
  - Sets the safe zone from the clinician’s first valid location.
  - Continuously checks if the clinician is within the safe zone.
  - Tracks how long a clinician is out-of-zone.
  - Sends an email alert if they remain out-of-zone for over 5 minutes.

- **index.js:**  
  Starts the monitoring service.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/venkatesh966/clinicianservice.git
   cd clinicianservice
   node index

   node version > 14

   check out the dev branch please
