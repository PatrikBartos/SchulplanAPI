import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.PASSWORD);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log('You successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
