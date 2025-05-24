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
    service: 'comment-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
const commentRoutes = require('./routes/comments');
app.use('/api/comments', commentRoutes);

const PORT = process.env.COMMENT_SERVICE_PORT || 3003;
const MONGO_URI = process.env.COMMENT_SERVICE_MONGO_URI || 'mongodb://localhost:27017/comment-service';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Comment Service MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Comment Service running on port ${PORT}`));
