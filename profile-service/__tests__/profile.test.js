const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const profileController = require('../controllers/profileController');

let mongoServer;
const app = express();
app.use(express.json());

// Mock middleware
app.use((req, res, next) => {
  req.userId = 'mockUserId';
  next();
});

// Mock routes
app.get('/api/profile/:userId', profileController.getProfile);
app.put('/api/profile', profileController.updateProfile);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Profile.deleteMany({});
});

describe('Profile Service', () => {
  describe('GET /api/profile/:userId', () => {
    it('should get user profile', async () => {
      // Create test profile
      await Profile.create({
        userId: 'mockUserId',
        bio: 'Test Bio',
        avatar: 'test-avatar.jpg',
        socialLinks: {
          twitter: 'twitter.com/test',
          github: 'github.com/test'
        }
      });

      const response = await request(app).get('/api/profile/mockUserId');

      expect(response.status).toBe(200);
      expect(response.body.bio).toBe('Test Bio');
      expect(response.body.avatar).toBe('test-avatar.jpg');
      expect(response.body.socialLinks.twitter).toBe('twitter.com/test');
    });

    it('should return 404 for non-existent profile', async () => {
      const response = await request(app).get('/api/profile/nonexistentId');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/profile')
        .send({
          bio: 'Updated Bio',
          avatar: 'new-avatar.jpg',
          socialLinks: {
            twitter: 'twitter.com/updated',
            github: 'github.com/updated'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');

      const profile = await Profile.findOne({ userId: 'mockUserId' });
      expect(profile.bio).toBe('Updated Bio');
      expect(profile.avatar).toBe('new-avatar.jpg');
      expect(profile.socialLinks.twitter).toBe('twitter.com/updated');
    });
  });
});
