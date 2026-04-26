const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    deliveryTime: { type: String }
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
