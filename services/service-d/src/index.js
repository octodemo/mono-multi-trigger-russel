const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

// In-memory payment store for demo
let payments = [
  { id: 1, orderId: 1, amount: 999.99, method: 'credit_card', status: 'completed', transactionId: 'txn_123' },
  { id: 2, orderId: 2, amount: 1399.98, method: 'paypal', status: 'pending', transactionId: 'txn_124' }
];
let nextId = 3;

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-service', version: '1.0.0' });
});

app.get('/payments', (req, res) => {
  const { orderId, status } = req.query;
  let filteredPayments = payments;
  
  if (orderId) {
    filteredPayments = filteredPayments.filter(p => p.orderId === parseInt(orderId));
  }
  
  if (status) {
    filteredPayments = filteredPayments.filter(p => p.status === status);
  }
  
  res.json(filteredPayments);
});

app.get('/payments/:id', (req, res) => {
  const payment = payments.find(p => p.id === parseInt(req.params.id));
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.json(payment);
});

app.post('/payments', (req, res) => {
  const { orderId, amount, method } = req.body;
  if (!orderId || !amount || !method) {
    return res.status(400).json({ error: 'OrderId, amount, and payment method are required' });
  }
  
  const validMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer'];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ error: 'Invalid payment method', validMethods });
  }
  
  // Simulate payment processing
  const isSuccessful = Math.random() > 0.1; // 90% success rate for demo
  
  const payment = { 
    id: nextId++, 
    orderId: parseInt(orderId), 
    amount: parseFloat(amount), 
    method,
    status: isSuccessful ? 'completed' : 'failed',
    transactionId: `txn_${Date.now()}`,
    processedAt: new Date().toISOString()
  };
  
  payments.push(payment);
  res.status(201).json(payment);
});

app.post('/payments/:id/refund', (req, res) => {
  const id = parseInt(req.params.id);
  const payment = payments.find(p => p.id === id);
  
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  if (payment.status !== 'completed') {
    return res.status(400).json({ error: 'Can only refund completed payments' });
  }
  
  const { amount } = req.body;
  const refundAmount = amount ? parseFloat(amount) : payment.amount;
  
  if (refundAmount > payment.amount) {
    return res.status(400).json({ error: 'Refund amount cannot exceed payment amount' });
  }
  
  const refund = {
    id: nextId++,
    orderId: payment.orderId,
    amount: -refundAmount,
    method: payment.method,
    status: 'completed',
    transactionId: `refund_${Date.now()}`,
    originalPaymentId: payment.id,
    processedAt: new Date().toISOString()
  };
  
  payments.push(refund);
  res.status(201).json(refund);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
  });
}

module.exports = app;