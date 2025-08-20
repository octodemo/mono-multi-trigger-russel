const request = require('supertest');
const app = require('../src/index');

describe('Notification Service', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'healthy',
        service: 'notification-service',
        version: '1.0.0'
      });
    });
  });

  describe('GET /notifications', () => {
    it('should return list of notifications', async () => {
      const response = await request(app).get('/notifications');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter notifications by userId', async () => {
      const response = await request(app).get('/notifications?userId=1');
      expect(response.status).toBe(200);
      response.body.forEach(notification => {
        expect(notification.userId).toBe(1);
      });
    });

    it('should filter notifications by type', async () => {
      const response = await request(app).get('/notifications?type=email');
      expect(response.status).toBe(200);
      response.body.forEach(notification => {
        expect(notification.type).toBe('email');
      });
    });
  });

  describe('POST /notifications', () => {
    it('should create a new notification', async () => {
      const newNotification = { 
        userId: 1, 
        type: 'email',
        subject: 'Test Subject',
        message: 'Test message'
      };
      const response = await request(app)
        .post('/notifications')
        .send(newNotification);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(newNotification.userId);
      expect(response.body.type).toBe(newNotification.type);
      expect(response.body.status).toBe('pending');
    });

    it('should return 400 for invalid notification type', async () => {
      const response = await request(app)
        .post('/notifications')
        .send({ userId: 1, type: 'invalid_type', message: 'test' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid notification type');
    });
  });

  describe('GET /notifications/stats/summary', () => {
    it('should return notification statistics', async () => {
      const response = await request(app).get('/notifications/stats/summary');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('pending');
      expect(response.body).toHaveProperty('sent');
      expect(response.body).toHaveProperty('byType');
    });
  });
});