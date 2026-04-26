const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already subscribed' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send Welcome Email
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com') {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"Subba Reddy's Liquor Shop" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to Subba Reddy's Liquor Shop 🥃",
          text: "Thank you for subscribing! Enjoy 10% off your first order with code SUBBA10. Cheers! — Subba Reddy"
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
      } catch (mailError) {
        console.error('Failed to send welcome email:', mailError);
        // Continue even if email fails
      }
    } else {
      console.log(`[MOCK] Welcome email would have been sent to ${email}`);
    }

    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
