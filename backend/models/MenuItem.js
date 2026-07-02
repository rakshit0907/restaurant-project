const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  tags: [String],
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
