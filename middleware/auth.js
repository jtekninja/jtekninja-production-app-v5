function requireAuth(req, res, next) {
  if (req.session?.isAuthenticated) {
    return next();
  }

  req.session.flash = { type: 'error', message: 'Please log in to access the dashboard.' };
  return res.redirect('/dashboard/login');
}

module.exports = { requireAuth };
