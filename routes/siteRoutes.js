const express = require('express');
const Lead = require('../models/Lead');
const { sendLeadAlert } = require('../services/alertService');

const router = express.Router();

router.get('/', async (req, res) => {
  const leadCount = await Lead.countDocuments().catch(() => 0);
  res.render('pages/home', {
    title: 'JTekNinja | Tech, Dropshipping, TikTok Organic',
    stats: {
      leadCount,
      businesses: 3,
      projects: 4
    }
  });
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, businessInterest, message } = req.body;

  if (!name || !email || !message) {
    req.session.flash = { type: 'error', message: 'Name, email, and message are required.' };
    return res.redirect('/#contact');
  }

  try {
    const lead = await Lead.create({
      name,
      email,
      phone,
      businessInterest,
      message,
      source: 'website'
    });

    sendLeadAlert(lead).catch((error) => {
      console.error('Lead alert email failed:', error.message);
    });

    req.session.flash = { type: 'success', message: 'Message sent successfully. I will get back to you soon.' };
    return res.redirect('/#contact');
  } catch (error) {
    console.error('Lead create failed:', error.message);
    req.session.flash = { type: 'error', message: 'Could not submit your message right now.' };
    return res.redirect('/#contact');
  }
});

module.exports = router;
