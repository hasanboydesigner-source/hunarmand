import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const makeAdmin = async () => {
  try {
    // Find the first user (likely the creator) or a specific email if provided
    const user = await User.findOne({ email: 'hasanboyleo97@gmail.com' }); // or whichever email the user uses
    
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`User ${user.email} is now an ADMIN!`);
    } else {
      // If specific email not found, just make the first craftsman an admin for testing
      const firstUser = await User.findOne({});
      if(firstUser) {
        firstUser.role = 'admin';
        await firstUser.save();
        console.log(`User ${firstUser.email} is now an ADMIN!`);
      } else {
        console.log('No users found in database');
      }
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

makeAdmin();
