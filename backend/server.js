require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB - connection string now lives in .env, not in source control
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is not set. Copy backend/.env.example to backend/.env and fill in your MongoDB connection string.');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err.message);
  });

// Routes

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Add menu item
app.post('/add-menu', async (req, res) => {
  const { name, description, price, category, image } = req.body;
  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }
  try {
    const newItem = new MenuItem({ name, description, price, category, image });
    await newItem.save();
    res.status(201).json({ message: 'Menu item added', item: newItem });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update a menu item
app.put('/update-menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;
  if (price !== undefined) updateFields.price = price;
  if (category !== undefined) updateFields.category = category;
  if (image !== undefined) updateFields.image = image;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item updated', item: updatedItem });
  } catch (error) {
    console.error('Error in PUT /update-menu/:id:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update a menu item's availability
app.patch('/update-menu/:id/availability', async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(id, { available }, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Availability updated', item: updatedItem });
  } catch (error) {
    console.error('Error in PATCH /update-menu/:id/availability:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update an order
app.put('/update-order/:id', async (req, res) => {
  const { id } = req.params;
  const { items, totalAmount, status } = req.body;

  const updateFields = {};
  if (items !== undefined) updateFields.items = items;
  if (totalAmount !== undefined) updateFields.totalAmount = totalAmount;
  if (status !== undefined) updateFields.status = status;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated', order: updatedOrder });
  } catch (error) {
    console.error('Error in PUT /update-order/:id:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete a menu item
app.delete('/delete-menu/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted', item: deletedItem });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete an order
app.delete('/delete-order/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted', order: deletedOrder });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Place order
app.post('/place-order', async (req, res) => {
  const { items, totalAmount } = req.body;
  if (!items || !items.length || !totalAmount) {
    return res.status(400).json({ error: 'Please provide all order details' });
  }
  try {
    const newOrder = new Order({ items, totalAmount });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed', order: newOrder });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get all menu items
app.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    console.error('Error in GET /menu:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
