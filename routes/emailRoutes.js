const express = require('express');
const { sendEmail } = require('../config/email');

const router = express.Router();

router.post('/test-email', async (req, res) => {
  try {
    const result = await sendEmail({
      to: process.env.ALERT_TO || process.env.EMAIL_USER,
      subject: 'JTekNinja test email',
      text: 'Your Gmail SMTP connection is working.',
      html: '<h2>JTekNinja test email</h2><p>Your Gmail SMTP connection is working.</p>'
    });

    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
