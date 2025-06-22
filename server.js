const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

app.use(cors());              // ✅ This line must be just after `app` is declared
app.use(bodyParser.json());

// Replace with your MongoDB Atlas connection string
const uri = "mongodb+srv://rakshitpandey0321:rakshit0321pandey@cluster0.dwi4vjg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(bodyParser.json());

// Define Mongoose schemas and models
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String } // ✅ Add this line
});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const orderSchema = new mongoose.Schema({
  items: [{
    item: String,
    quantity: Number
  }],
  totalAmount: Number,
  status: { type: String, default: 'Placed' }
});
const Order = mongoose.model('Order', orderSchema);

// Routes

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Add menu item
app.post('/add-menu', async (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }
  try {
    const newItem = new MenuItem({ name, description, price, category });
    await newItem.save();
    res.status(201).json({ message: 'Menu item added', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Update a menu item
app.put('/update-menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price, category },
      { new: true } // returns the updated document
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item updated', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/update-order/:id', async (req, res) => {
  const { id } = req.params;
  const { items, totalAmount, status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { items, totalAmount, status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
  }
});


// Place order
app.post('/place-order', async (req, res) => {
  const { items, totalAmount } = req.body;
  if (!items || !totalAmount) {
    return res.status(400).json({ error: 'Please provide all order details' });
  }
  try {
    const newOrder = new Order({ items, totalAmount });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all menu items
app.get('/menu', async (req, res) => {
  console.log('GET /menu called'); 
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
