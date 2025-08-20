const request = require('supertest');
const app = require('../src/index');

describe('Order Management Service', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'healthy',
        service: 'order-management',
        version: '1.0.0'
      });
    });
  });

  describe('GET /orders', () => {
    it('should return list of orders', async () => {
      const response = await request(app).get('/orders');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter orders by userId', async () => {
      const response = await request(app).get('/orders?userId=1');
      expect(response.status).toBe(200);
      response.body.forEach(order => {
        expect(order.userId).toBe(1);
      });
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const newOrder = { 
        userId: 1, 
        products: [{ id: 1, quantity: 2, price: 50 }]
      };
      const response = await request(app)
        .post('/orders')
        .send(newOrder);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(newOrder.userId);
      expect(response.body.status).toBe('pending');
      expect(response.body.total).toBe(100);
    });
  });

  describe('PUT /orders/:id/status', () => {
    it('should update order status', async () => {
      const response = await request(app)
        .put('/orders/1/status')
        .send({ status: 'completed' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
      expect(response.body).toHaveProperty('updatedAt');
    });
  });
});