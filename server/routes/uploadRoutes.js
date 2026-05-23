import express from 'express';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// @route POST /api/upload
// "image" is the name of the field in the form data
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Rasm yuklanmadi' });
  }
  // req.file.path contains the URL to the uploaded image on Cloudinary
  res.json({ url: req.file.path });
});

export default router;
