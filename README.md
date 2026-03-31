# JTekNinja Production App

A production-ready Node.js app with:
- Express server
- EJS website pages
- MongoDB lead storage
- Gmail SMTP alerts using a Google App Password
- Admin dashboard login
- Security middleware and rate limiting

## 1. Install

```bash
npm install
```

## 2. Create `.env`

Copy the example file:

```bash
cp .env.example .env
```

Then update these values in `.env`:
- `MONGO_URI`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `ALERT_TO`

## 3. Start the app

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## 4. Routes

- `/` public website
- `/dashboard/login` admin login page
- `/dashboard` private dashboard
- `/health` health check
- `POST /api/email/test-email` send a test Gmail message
- `GET /api/leads` private lead API

## 5. Gmail setup

Use these Gmail SMTP settings:
- Host: `smtp.gmail.com`
- Port: `587`
- Secure: `false`
- Username: `jtekninja@gmail.com`
- Password: your Google App Password

Do not use your normal Gmail password.

## 6. MongoDB Atlas quick notes

- Add your current IP in Atlas Network Access
- Use the correct database username and password in the connection string
- If your password contains special characters, URL-encode them

## 7. Security

This zip includes:
- `.gitignore`
- `.env.example`
- session cookie config
- Helmet
- HPP
- Compression
- Rate limiting

## 8. Deploy

You can deploy this on Render, Railway, or a VPS.
Set all environment variables in the hosting dashboard before starting the service.
