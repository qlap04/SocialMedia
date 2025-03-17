import mongoose from 'mongoose';
import { ENV } from './env.config';

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGODB_URL!);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
