const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const BLOG_SERVICE_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:3002';
const COMMENT_SERVICE_URL = process.env.COMMENT_SERVICE_URL || 'http://localhost:3003';
const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://localhost:3004';

// Proxy configurations
const authProxy = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  }
});

const blogProxy = createProxyMiddleware({
  target: BLOG_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/blogs': '/api/blogs'
  }
});

const commentProxy = createProxyMiddleware({
  target: COMMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/comments': '/api/comments'
  }
});

const profileProxy = createProxyMiddleware({
  target: PROFILE_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/profile': '/api/profile'
  }
});

// Routes
app.use('/api/auth', authProxy);
app.use('/api/blogs', blogProxy);
app.use('/api/comments', commentProxy);
app.use('/api/profile', profileProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
