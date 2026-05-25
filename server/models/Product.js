import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  helpful: { type: Number, default: 0 },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inStock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  image: { type: String, required: true },
  images: [{ type: String }],
  model3DUrl: { type: String },
  sku: { type: String },
  preparationTime: { type: String },
  material: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [reviewSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectReason: { type: String },
  craftsman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
