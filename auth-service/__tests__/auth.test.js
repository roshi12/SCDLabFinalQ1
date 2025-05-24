const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../models/User');
const authController = require('../controllers/authController');

let mongoServer;
const app = express();
app.use(express.json());

// Mock routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Service', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');

      const user = await User.findOne({ email: 'test@test.com' });
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'testuser',
        email: 'test@test.com',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();

      // Verify JWT token
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'your_jwt_secret');
      expect(decoded).toBeTruthy();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
