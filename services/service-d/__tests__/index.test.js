const request = require('supertest');
const app = require('../src/index');

describe('Payment Service', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'healthy',
        service: 'payment-service',
        version: '1.0.0'
      });
    });
  });

  describe('GET /payments', () => {
    it('should return list of payments', async () => {
      const response = await request(app).get('/payments');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter payments by orderId', async () => {
      const response = await request(app).get('/payments?orderId=1');
      expect(response.status).toBe(200);
      response.body.forEach(payment => {
        expect(payment.orderId).toBe(1);
      });
    });
  });

  describe('POST /payments', () => {
    it('should process a new payment', async () => {
      const newPayment = { 
        orderId: 1, 
        amount: 100.00,
        method: 'credit_card'
      };
      const response = await request(app)
        .post('/payments')
        .send(newPayment);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.orderId).toBe(newPayment.orderId);
      expect(response.body.amount).toBe(newPayment.amount);
      expect(['completed', 'failed']).toContain(response.body.status);
      expect(response.body).toHaveProperty('transactionId');
    });

    it('should return 400 for invalid payment method', async () => {
      const response = await request(app)
        .post('/payments')
        .send({ orderId: 1, amount: 100, method: 'invalid_method' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid payment method');
    });
  });

  describe('POST /payments/:id/refund', () => {
    it('should process a refund for completed payment', async () => {
      const response = await request(app)
        .post('/payments/1/refund')
        .send({ amount: 50.00 });
      
      expect(response.status).toBe(201);
      expect(response.body.amount).toBe(-50.00);
      expect(response.body.status).toBe('completed');
      expect(response.body.originalPaymentId).toBe(1);
    });
  });
});