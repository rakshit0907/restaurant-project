const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String }, // optional - not yet collected by the frontend form
  items: [{
    item: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Placed', 'pending', 'completed', 'cancelled'], default: 'Placed' },
  orderTime: { type: Date, default: Date.now },
  estimatedReadyTime: { type: Date }
});

module.exports = mongoose.model('Order', OrderSchema);
