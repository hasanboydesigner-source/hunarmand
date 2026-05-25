import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const fixStock = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const carpet = await Product.findOne({ title: "Gilam Antikvariat ssr" });
  if (!carpet) {
    console.log("Not found");
    return;
  }
  
  const orders = await Order.find({ "items.product": carpet._id });
  let restoredStock = 0;
  for (const order of orders) {
    const item = order.items.find(i => i.product.toString() === carpet._id.toString());
    if (item) {
      restoredStock += item.quantity;
    }
    await Order.findByIdAndDelete(order._id);
    console.log(`Deleted order ${order._id}`);
  }
  
  carpet.inStock += restoredStock;
  if(carpet.inStock <= 0) carpet.inStock = 1; // Default to 1 if it's still zero or less
  carpet.sold = Math.max(0, carpet.sold - restoredStock);
  await carpet.save();
  console.log(`Restored stock: +${restoredStock}. New stock: ${carpet.inStock}, sold: ${carpet.sold}`);
  process.exit();
}
fixStock();
