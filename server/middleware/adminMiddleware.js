import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      req.user = await User.findById(decoded.id).select('-password');

      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Ruxsat etilmagan: Faqat adminlar kirishi mumkin' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Ruxsat etilmagan: Noto\'g\'ri token' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Ruxsat etilmagan: Token topilmadi' });
  }
};
