import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderItemTitle: {
      type: String,
      required: true,
    },
    orderItemImage: {
      type: String,
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    craftsman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
