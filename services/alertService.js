const { sendEmail } = require('../config/email');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendLeadAlert(lead) {
  const to = process.env.ALERT_TO || process.env.EMAIL_USER;
  if (!to) {
    return null;
  }

  const subject = `New JTekNinja lead: ${lead.name}`;
  const text = [
    'A new lead was submitted on your website.',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || 'N/A'}`,
    `Business Interest: ${lead.businessInterest || 'N/A'}`,
    `Message: ${lead.message}`
  ].join('\n');

  const html = `
    <h2>New JTekNinja Lead</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'N/A')}</p>
    <p><strong>Business Interest:</strong> ${escapeHtml(lead.businessInterest || 'N/A')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, '<br>')}</p>
  `;

  return sendEmail({ to, subject, text, html });
}

module.exports = { sendLeadAlert };
