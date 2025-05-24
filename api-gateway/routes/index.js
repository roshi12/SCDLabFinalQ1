const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      blog: process.env.BLOG_SERVICE_URL,
      comment: process.env.COMMENT_SERVICE_URL,
      profile: process.env.PROFILE_SERVICE_URL
    }
  });
});

module.exports = router;
