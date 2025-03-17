import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    MONGODB_URL: process.env.MONGODB_URL,
    PORT: process.env.PORT || 3039,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    EMAIL_MAIN: process.env.EMAIL_MAIN,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    REDIS_URL: process.env.REDIS_URL,
}
