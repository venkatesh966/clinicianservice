// emailService.js
const nodemailer = require('nodemailer');
const { SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, FROM_EMAIL, TO_EMAIL } = require('./config');
const { sleep } = require('./utils');

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER,
  port: SMTP_PORT,
  secure: false, 
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});


async function sendEmailAlert(clinicianId, alertThresholdSeconds) {
  const subject = `ALERT: Clinician ${clinicianId} Out of Safe Zone`;
  const body = `Clinician ${clinicianId} has been detected out-of-zone for over ${alertThresholdSeconds / 60} minutes.`;

  const mailOptions = {
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject,
    text: body,
  };

  const maxEmailRetries = 3;
  let retries = 0;
  let delay = 1000;

  while (retries < maxEmailRetries) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Alert email sent for clinician ${clinicianId}`);
      return true;
    } catch (error) {
      console.error(`Failed to send email for clinician ${clinicianId}: ${error.message}`);
      retries++;
      await sleep(delay);
      delay *= 2;
    }
  }
  console.error(`Exceeded max email retries for clinician ${clinicianId}`);
  return false;
}

module.exports = { sendEmailAlert };
