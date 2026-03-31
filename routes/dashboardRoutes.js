const express = require('express');
const Lead = require('../models/Lead');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session?.isAuthenticated) {
    return res.redirect('/dashboard');
  }

  return res.render('pages/login', { title: 'Dashboard Login' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (email === validEmail && password === validPassword) {
    req.session.isAuthenticated = true;
    req.session.flash = { type: 'success', message: 'Logged in successfully.' };
    return res.redirect('/dashboard');
  }

  req.session.flash = { type: 'error', message: 'Invalid login credentials.' };
  return res.redirect('/dashboard/login');
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/dashboard/login');
  });
});

router.get('/', requireAuth, async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 }).limit(100).lean().catch(() => []);
  const leadCount = await Lead.countDocuments().catch(() => 0);

  res.render('pages/dashboard', {
    title: 'Dashboard',
    leads,
    metrics: {
      leadCount,
      today: leads.filter((lead) => new Date(lead.createdAt).toDateString() === new Date().toDateString()).length,
      withPhone: leads.filter((lead) => lead.phone).length
    }
  });
});

module.exports = router;
