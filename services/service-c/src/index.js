const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// In-memory order store for demo
let orders = [
  { id: 1, userId: 1, products: [{ id: 1, quantity: 1 }], status: 'pending', total: 999.99 },
  { id: 2, userId: 2, products: [{ id: 2, quantity: 2 }], status: 'completed', total: 1399.98 }
];
let nextId = 3;

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-management', version: '1.0.0' });
});

app.get('/orders', (req, res) => {
  const { userId, status } = req.query;
  let filteredOrders = orders;
  
  if (userId) {
    filteredOrders = filteredOrders.filter(o => o.userId === parseInt(userId));
  }
  
  if (status) {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }
  
  res.json(filteredOrders);
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/orders', (req, res) => {
  const { userId, products } = req.body;
  if (!userId || !products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'UserId and products array are required' });
  }
  
  // Calculate total (simplified - in real app would lookup product prices)
  const total = products.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  
  const order = { 
    id: nextId++, 
    userId: parseInt(userId), 
    products, 
    status: 'pending',
    total: parseFloat(total.toFixed(2)),
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

app.put('/orders/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const orderIndex = orders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Valid status is required', validStatuses });
  }
  
  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  
  res.json(orders[orderIndex]);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Order Management Service running on port ${PORT}`);
  });
}

module.exports = app;