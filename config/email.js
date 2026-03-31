const nodemailer = require('nodemailer');

function createTransport() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: String(process.env.EMAIL_SECURE) === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

const transporter = createTransport();

async function verifyEmailTransport() {
  if (!transporter) {
    console.warn('Email not configured yet. Add EMAIL_USER and EMAIL_PASS in .env.');
    return false;
  }

  await transporter.verify();
  console.log('Email transporter verified');
  return true;
}

async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    throw new Error('Email transport not configured. Add Gmail SMTP settings to .env.');
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
}

module.exports = {
  transporter,
  verifyEmailTransport,
  sendEmail
};
