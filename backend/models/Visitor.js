const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  userAgent: { type: String },
  page: { type: String, required: true },
  country: { type: String },
  city: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
