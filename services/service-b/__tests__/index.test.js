const request = require('supertest');
const app = require('../src/index');

describe('Product Catalog Service', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'healthy',
        service: 'product-catalog',
        version: '1.0.0'
      });
    });
  });

  describe('GET /products', () => {
    it('should return list of products', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
      const response = await request(app).get('/products?category=Electronics');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });
  });

  describe('GET /products/:id', () => {
    it('should return a specific product', async () => {
      const response = await request(app).get('/products/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('category');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/products/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = { 
        name: 'Test Product', 
        price: 49.99, 
        category: 'Test',
        stock: 5
      };
      const response = await request(app)
        .post('/products')
        .send(newProduct);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);
      expect(response.body.category).toBe(newProduct.category);
      expect(response.body.stock).toBe(newProduct.stock);
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/products')
        .send({ name: 'Test Product' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Name, price, and category are required');
    });
  });
});