import mongoose from 'mongoose';
import run from '../bars_db.js'

const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);
    run()
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); 
  }
};

export default connectDB;
