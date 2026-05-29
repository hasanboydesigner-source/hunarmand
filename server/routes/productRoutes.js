import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

// @route GET /api/products
router.get('/', async (req, res) => {
  try {
    let products = await Product.find({});
    
    // Attempt populate but ignore errors for corrupt records
    try {
      await Product.populate(products, { path: 'craftsman', select: 'name region rating' });
    } catch (popErr) {
      console.warn("Populate error for some products:", popErr.message);
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Mahsulot topilmadi (Noto\'g\'ri ID formati)' });
    }
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });
    
    try {
      await product.populate('craftsman', 'name region rating isVerified whatsapp');
    } catch (popErr) {
      console.warn("Populate error:", popErr.message);
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/products/:id/view
// @desc Increment view count of a product
router.post('/:id/view', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Mahsulot topilmadi' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });
    res.json({ message: 'Ko\'rilishlar soni oshirildi', views: product.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/products
router.post('/', async (req, res) => {
  try {
    const { title, price, inStock, category, image, images, craftsmanId, description, sku, preparationTime, material } = req.body;
    
    const craftsman = await User.findById(craftsmanId);
    if (!craftsman || (craftsman.role !== 'craftsman' && craftsman.role !== 'admin')) {
      return res.status(400).json({ message: 'Ruxsat yo\'q yoki hunarmand topilmadi' });
    }

    const product = new Product({
      title,
      price,
      inStock,
      category,
      image,
      images: images || [image],
      description,
      sku,
      preparationTime,
      material,
      craftsman: craftsman._id
    });

    const createdProduct = await product.save();
    await createdProduct.populate('craftsman', 'name region rating');
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Mahsulot topilmadi (Noto\'g\'ri ID formati)' });
    }
    const { title, price, inStock, category, image, images, description, sku, preparationTime, material } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.price = price !== undefined ? price : product.price;
      product.inStock = inStock !== undefined ? inStock : product.inStock;
      product.category = category || product.category;
      product.image = image || product.image;
      if (images) product.images = images;
      product.description = description !== undefined ? description : product.description;
      product.sku = sku !== undefined ? sku : product.sku;
      product.preparationTime = preparationTime !== undefined ? preparationTime : product.preparationTime;
      product.material = material !== undefined ? material : product.material;

      const updatedProduct = await product.save();
      // Populate craftsman before sending back so UI doesn't lose it
      await updatedProduct.populate('craftsman', 'name region rating');
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Mahsulot topilmadi' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Mahsulot topilmadi (Noto\'g\'ri ID formati)' });
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Mahsulot o\'chirildi' });
    } else {
      res.status(404).json({ message: 'Mahsulot topilmadi' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add a review to a product
router.post('/:id/reviews', async (req, res) => {
  try {
    const { author, rating, text } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = {
        author,
        rating: Number(rating),
        text,
      };

      product.reviews.push(review);
      product.reviewCount = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
