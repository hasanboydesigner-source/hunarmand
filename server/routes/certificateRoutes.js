import express from 'express';
import Certificate from '../models/Certificate.js';
import Order from '../models/Order.js';

const router = express.Router();

// Get certificate by ID (Public route, anyone with the link can verify)
router.get('/:certificateId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('craftsman', 'name shopName region bio avatar')
      .populate('product', 'category description');

    if (!cert) {
      return res.status(404).json({ message: 'Sertifikat topilmadi' });
    }

    res.json(cert);
  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({ message: 'Sertifikatni yuklashda xatolik yuz berdi' });
  }
});

// Get all certificates for a customer (Protected route usually, but for mock auth we can use customerId from query)
router.get('/customer/:customerId', async (req, res) => {
  try {
    // Find orders for this customer
    const orders = await Order.find({ customerId: req.params.customerId }).select('_id');
    const orderIds = orders.map(o => o._id);

    const certs = await Certificate.find({ order: { $in: orderIds } })
      .sort({ createdAt: -1 });

    res.json(certs);
  } catch (error) {
    console.error('Customer certificates fetch error:', error);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
});

export default router;
