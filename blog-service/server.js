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
    service: 'blog-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
const blogRoutes = require('./routes/blogs');
app.use('/api/blogs', blogRoutes);

const PORT = process.env.BLOG_SERVICE_PORT || 3002;
const MONGO_URI = process.env.BLOG_SERVICE_MONGO_URI || 'mongodb://localhost:27017/blog-service';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Blog Service MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Blog Service running on port ${PORT}`));
