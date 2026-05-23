import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'craftsman', 'admin'], default: 'customer' },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  phone: { type: String },
  // Craftsman specific fields
  region: { type: String },
  specialty: { type: String },
  bio: { type: String },
  yearsExp: { type: Number, default: 0 },
  shopName: { type: String },
  whatsapp: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
