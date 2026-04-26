const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, paymentMethod } = req.body;

    if (!customer || !items || items.length === 0 || !total || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    const newOrder = new Order({
      customer,
      items,
      total,
      paymentMethod
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order created successfully', orderId: newOrder._id });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
