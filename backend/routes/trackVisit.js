const express = require('express');
const router = express.Router();
const axios = require('axios');
const Visitor = require('../models/Visitor');

router.post('/', async (req, res) => {
  try {
    const { page, userAgent } = req.body;
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // For local testing, handle IPv6 localhost loopback
    if (ip === '::1') {
      ip = '127.0.0.1';
    }

    let country = 'Unknown';
    let city = 'Unknown';

    // Fetch Geo location from ip-api
    try {
      if (ip !== '127.0.0.1') {
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        if (geoResponse.data.status === 'success') {
          country = geoResponse.data.country;
          city = geoResponse.data.city;
        }
      } else {
        country = 'Localhost';
        city = 'Localhost';
      }
    } catch (err) {
      console.error('Geo IP error:', err.message);
    }

    const newVisitor = new Visitor({
      ip,
      userAgent,
      page,
      country,
      city
    });

    await newVisitor.save();
    res.status(200).json({ success: true, message: 'Visit tracked' });
  } catch (error) {
    console.error('Visit track error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
