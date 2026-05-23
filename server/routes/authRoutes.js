import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, region } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Ushbu email bilan avval ro\'yxatdan o\'tilgan' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      phone,
      region: role === 'craftsman' ? region : undefined,
      isVerified: role === 'craftsman' ? false : undefined,
      shopName: role === 'craftsman' ? `${name} ustaxonasi` : undefined
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Noto\'g\'ri email yoki parol' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/craftsmen
router.get('/craftsmen', async (req, res) => {
  try {
    const craftsmen = await User.find({ role: 'craftsman' }).select('-password');
    res.json(craftsmen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// @route GET /api/auth/craftsmen/:id
router.get('/craftsmen/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Hunarmand topilmadi (Noto\'g\'ri ID formati)' });
    }
    const craftsman = await User.findById(req.params.id).select('-password');
    if (!craftsman || craftsman.role !== 'craftsman') {
      return res.status(404).json({ message: 'Hunarmand topilmadi' });
    }
    res.json(craftsman);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, email, phone, region, specialty, bio, shopName, whatsapp, yearsExp } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;
    user.region = region !== undefined ? region : user.region;
    user.specialty = specialty !== undefined ? specialty : user.specialty;
    user.bio = bio !== undefined ? bio : user.bio;
    user.shopName = shopName !== undefined ? shopName : user.shopName;
    user.whatsapp = whatsapp !== undefined ? whatsapp : user.whatsapp;
    user.yearsExp = yearsExp !== undefined ? Number(yearsExp) : user.yearsExp;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      region: updatedUser.region,
      specialty: updatedUser.specialty,
      bio: updatedUser.bio,
      shopName: updatedUser.shopName,
      whatsapp: updatedUser.whatsapp,
      yearsExp: updatedUser.yearsExp,
      isVerified: updatedUser.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
