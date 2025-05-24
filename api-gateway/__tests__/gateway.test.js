const request = require('supertest');
const express = require('express');
const app = express();

// Mock proxy middleware
jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn((config) => (req, res, next) => {
    res.json({ message: 'Proxied successfully' });
  })
}));

// Import after mocking
const server = require('../server');

describe('API Gateway', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });

  describe('Proxy Routes', () => {
    it('should proxy auth service requests', async () => {
      const response = await request(app).post('/api/auth/login');
      expect(response.body).toHaveProperty('message', 'Proxied successfully');
    });

    it('should proxy blog service requests', async () => {
      const response = await request(app).get('/api/blogs');
      expect(response.body).toHaveProperty('message', 'Proxied successfully');
    });

    it('should proxy comment service requests', async () => {
      const response = await request(app).get('/api/comments');
      expect(response.body).toHaveProperty('message', 'Proxied successfully');
    });

    it('should proxy profile service requests', async () => {
      const response = await request(app).get('/api/profile');
      expect(response.body).toHaveProperty('message', 'Proxied successfully');
    });
  });
});
