import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dropDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    await mongoose.connection.db.dropDatabase();
    console.log('Database completely dropped!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

dropDB();
