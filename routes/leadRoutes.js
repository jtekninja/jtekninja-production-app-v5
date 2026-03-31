const express = require('express');
const Lead = require('../models/Lead');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: leads.length, leads });
});

module.exports = router;
