// config.js
module.exports = {
    API_BASE_URL: "https://3qbqr98twd.execute-api.us-west-2.amazonaws.com/test/clinicianstatus/",
    CLINICIAN_IDS: [1, 2, 3, 4, 5, 6, 7],
    SAFE_ZONE_RADIUS_METERS: 50,
    ALERT_THRESHOLD_SECONDS: 5 * 60,
    POLLING_INTERVAL_SECONDS: 30,
    MAX_API_RETRIES: 3,
    SMTP_SERVER: "smtp.gmail.com",
    SMTP_PORT: 587,
    SMTP_USERNAME: "venkateshmorpojuchary@gmail.com",
    SMTP_PASSWORD: "dummypassword",
    FROM_EMAIL: "venkateshmorpojuchary@gmail.com",
    TO_EMAIL: "coding-challenges+clin-alerts@sprinterhealth.com"
  };
  