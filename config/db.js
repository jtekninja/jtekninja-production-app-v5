const mongoose = require('mongoose');

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set. Database features will not work until you add it to .env.');
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
}

module.exports = { connectDatabase };
