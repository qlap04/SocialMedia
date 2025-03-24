import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.config';

cloudinary.config({
  cloud_name: ENV.CLOUD_NAME,
  api_key: ENV.API_KEY,
  api_secret: ENV.API_SECRET,
});

console.log('Cloudinary config:', {
  cloud_name: ENV.CLOUD_NAME,
  api_key: ENV.API_KEY,
  api_secret: ENV.API_SECRET,
});

export default cloudinary;