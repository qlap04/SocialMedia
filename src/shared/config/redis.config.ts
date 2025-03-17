import { createClient } from "redis";
import { ENV } from './env.config';
import { error } from "console";

export const redisClient = createClient({
  url: ENV.REDIS_URL
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error('Redis connection error:', error);
    process.exit(1);
  }
};