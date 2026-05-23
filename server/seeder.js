import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import { MOCK_USERS, MOCK_PRODUCTS } from './data/mockData.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = [];

    // Hash passwords and create users
    for (const user of MOCK_USERS) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const createdUser = await User.create({ ...user, password: hashedPassword });
      createdUsers.push(createdUser);
    }

    // Assign craftsmen to products
    const sampleProducts = MOCK_PRODUCTS.map(product => {
      const craftsman = createdUsers.find(u => u.email === product.craftsmanEmail);
      return {
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        inStock: product.inStock,
        sold: product.sold,
        rating: product.rating,
        craftsman: craftsman ? craftsman._id : createdUsers[0]._id
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Ma\'lumotlar muvaffaqiyatli yuklandi!');
    process.exit();
  } catch (error) {
    console.error(`Xatolik: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    // Assuming Order and Message models exist or we can just import them
    // Actually, I should import them at the top if I use them.
    // I'll just run a node script directly instead to wipe everything safely.
    // Let's modify seeder to include it if imported, but to avoid import errors, I will use mongoose.connection.db.dropDatabase().
  } catch (error) {
    console.error(`Xatolik: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
