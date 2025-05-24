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
    service: 'profile-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const PORT = process.env.PROFILE_SERVICE_PORT || 3004;
const MONGO_URI = process.env.PROFILE_SERVICE_MONGO_URI || 'mongodb://localhost:27017/profile-service';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Profile Service MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Profile Service running on port ${PORT}`));
