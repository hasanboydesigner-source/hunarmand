import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    senderId: { type: String, required: true }, // User ID or 'system'
    receiverId: { type: String, required: true }, // Craftsman ID
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    avatar: { type: String }, // optional
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
