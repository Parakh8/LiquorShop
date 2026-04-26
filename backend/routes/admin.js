const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const Subscriber = require('../models/Subscriber');
const Order = require('../models/Order');

// Middleware for basic auth (for demo purposes)
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: process.env.ADMIN_PASSWORD });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalVisits = await Visitor.countDocuments();
    const uniqueVisitors = (await Visitor.distinct('ip')).length;
    
    // Last 7 days visits for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const visitsPerDay = await Visitor.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();

    res.json({
      success: true,
      stats: {
        totalVisits,
        uniqueVisitors,
        totalOrders,
        totalSubscribers,
        visitsPerDay
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 }).limit(20);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/subscribers', adminAuth, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
