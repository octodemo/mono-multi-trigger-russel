const express = require('express');
const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// In-memory notification store for demo
let notifications = [
  { id: 1, userId: 1, type: 'email', subject: 'Welcome', message: 'Welcome to our service!', status: 'sent', sentAt: '2024-01-01T10:00:00Z' },
  { id: 2, userId: 2, type: 'sms', subject: null, message: 'Your order has been confirmed', status: 'pending', createdAt: '2024-01-01T11:00:00Z' }
];
let nextId = 3;

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'notification-service', version: '1.0.0' });
});

app.get('/notifications', (req, res) => {
  const { userId, type, status } = req.query;
  let filteredNotifications = notifications;
  
  if (userId) {
    filteredNotifications = filteredNotifications.filter(n => n.userId === parseInt(userId));
  }
  
  if (type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === type);
  }
  
  if (status) {
    filteredNotifications = filteredNotifications.filter(n => n.status === status);
  }
  
  res.json(filteredNotifications);
});

app.get('/notifications/:id', (req, res) => {
  const notification = notifications.find(n => n.id === parseInt(req.params.id));
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  res.json(notification);
});

app.post('/notifications', (req, res) => {
  const { userId, type, subject, message } = req.body;
  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'UserId, type, and message are required' });
  }
  
  const validTypes = ['email', 'sms', 'push', 'webhook'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid notification type', validTypes });
  }
  
  const notification = { 
    id: nextId++, 
    userId: parseInt(userId), 
    type,
    subject: subject || null,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  notifications.push(notification);
  res.status(201).json(notification);
});

app.post('/notifications/:id/send', (req, res) => {
  const id = parseInt(req.params.id);
  const notificationIndex = notifications.findIndex(n => n.id === id);
  
  if (notificationIndex === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  const notification = notifications[notificationIndex];
  
  if (notification.status !== 'pending') {
    return res.status(400).json({ error: 'Can only send pending notifications' });
  }
  
  // Simulate sending (90% success rate for demo)
  const isSuccessful = Math.random() > 0.1;
  
  notifications[notificationIndex] = {
    ...notification,
    status: isSuccessful ? 'sent' : 'failed',
    sentAt: isSuccessful ? new Date().toISOString() : undefined,
    error: isSuccessful ? undefined : 'Failed to deliver notification'
  };
  
  res.json(notifications[notificationIndex]);
});

app.get('/notifications/stats/summary', (req, res) => {
  const stats = {
    total: notifications.length,
    pending: notifications.filter(n => n.status === 'pending').length,
    sent: notifications.filter(n => n.status === 'sent').length,
    failed: notifications.filter(n => n.status === 'failed').length,
    byType: {
      email: notifications.filter(n => n.type === 'email').length,
      sms: notifications.filter(n => n.type === 'sms').length,
      push: notifications.filter(n => n.type === 'push').length,
      webhook: notifications.filter(n => n.type === 'webhook').length
    }
  };
  
  res.json(stats);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
  });
}

module.exports = app;