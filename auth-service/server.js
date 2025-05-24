const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.AUTH_SERVICE_PORT || 3001;
const MONGO_URI = process.env.AUTH_SERVICE_MONGO_URI || 'mongodb://localhost:27017/auth-service';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Auth Service MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
