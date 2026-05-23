import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
router.post('/', async (req, res) => {
  try {
    const { sender, senderId, receiverId, text, productId, avatar } = req.body;
    
    if (!text || !receiverId) {
      return res.status(400).json({ message: 'Text and receiverId are required' });
    }

    const newMessage = new Message({
      sender,
      senderId,
      receiverId,
      text,
      productId,
      avatar
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/craftsman/:id
// @desc    Get all messages for a craftsman
router.get('/craftsman/:id', async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.params.id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      message.isRead = true;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
