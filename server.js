require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { generalLimiter, authLimiter } = require('./middleware/rateLimit');
const { connectDatabase } = require('./config/db');
const { verifyEmailTransport } = require('./config/email');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 10000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(hpp());
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(generalLimiter);

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'change-this-session-secret-immediately',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8
  }
};

if (process.env.MONGO_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  });
}

app.use(session(sessionConfig));

app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.isAuthenticated = Boolean(req.session?.isAuthenticated);
  res.locals.appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

app.use('/', require('./routes/siteRoutes'));
app.use('/dashboard', authLimiter, require('./routes/dashboardRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

app.get('/health', async (req, res) => {
  const leadCount = await Lead.countDocuments().catch(() => 0);
  res.json({
    success: true,
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
    leadCount,
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err);
  const status = err.status || 500;
  res.status(status).render('pages/error', {
    title: 'Server Error',
    message: isProduction ? 'Something went wrong.' : err.message,
    status
  });
});

function start() {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JTekNinja app running on port ${PORT}`);
  });

  connectDatabase()
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
    });

  verifyEmailTransport()
    .then(() => {
      console.log("Email transport verified");
    })
    .catch((error) => {
      console.error("Email transport verification failed:", error);
    });
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
