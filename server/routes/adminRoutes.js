import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protectAdmin);

// @route   GET /api/admin/stats
// @desc    Get global statistics for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    
    // Calculate total revenue (example using all orders)
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => {
      // Use totalAmount or amount field
      return acc + (order.totalAmount || order.amount || 0);
    }, 0);

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      revenue: totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (craftsmen and customers)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify or Unverify a craftsman (Grant Trust Certificate)
router.put('/users/:id/verify', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

    user.isVerified = !user.isVerified;
    await user.save();
    
    res.json({ message: user.isVerified ? 'Hunarmand tasdiqlandi' : 'Sertifikat bekor qilindi', isVerified: user.isVerified });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Ban or activate a user
router.put('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

    user.status = user.status === 'banned' ? 'active' : 'banned';
    await user.save();
    
    res.json({ message: `Foydalanuvchi holati: ${user.status}`, status: user.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('craftsman', 'name email').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete a product (Admin override)
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });

    await product.deleteOne();
    res.json({ message: 'Mahsulot muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
