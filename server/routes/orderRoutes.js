import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
  try {
    const { 
      customer, 
      customerId,
      items, 
      craftsmanId, 
      totalAmount, 
      paymentMethod, 
      deliveryMethod 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Generate random order number e.g. HM-48291
    const orderNumber = '#HM-' + Math.floor(10000 + Math.random() * 90000);

    const order = new Order({
      orderNumber,
      customer,
      customerId,
      items,
      craftsmanId,
      totalAmount,
      paymentMethod,
      deliveryMethod,
      status: 'pending'
    });

    const createdOrder = await order.save();

    // Increment sold count for each product in the order
    if (items && items.length > 0) {
      for (const item of items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { sold: item.quantity || 1 } });
        }
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/craftsman/:id
// @desc    Get orders for a specific craftsman
router.get('/craftsman/:id', async (req, res) => {
  try {
    const orders = await Order.find({ craftsmanId: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/customer/:id
// @desc    Get orders for a specific customer
router.get('/customer/:id', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
