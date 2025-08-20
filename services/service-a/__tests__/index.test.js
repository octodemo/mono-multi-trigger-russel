const request = require('supertest');
const app = require('../src/index');

describe('User Management Service', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'healthy',
        service: 'user-management',
        version: '1.0.0'
      });
    });
  });

  describe('GET /users', () => {
    it('should return list of users', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user', async () => {
      const response = await request(app).get('/users/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/users/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'Test User', email: 'test@example.com' };
      const response = await request(app)
        .post('/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Name and email are required');
    });
  });
});