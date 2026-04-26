require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
const trackVisitRoute = require('./routes/trackVisit');
const subscribeRoute = require('./routes/subscribe');
const ordersRoute = require('./routes/orders');
const contactRoute = require('./routes/contact');
const adminRoute = require('./routes/admin');

app.use('/api/track-visit', trackVisitRoute);
app.use('/api/subscribe', subscribeRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/contact', contactRoute);
app.use('/api/admin', adminRoute);

// Database Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
