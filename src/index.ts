import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { connectDB } from '../src/shared/config/db.config'
import { connectRedis } from './shared/config/redis.config';
import AuthRouter from './api/v1/auth/auth.route';

// import otpRouter from '@routes/otp.route';


// app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(helmet());
app.use(cookieParser());
// app.use(cors({
//     origin: (origin, callback) => {
//         const allowedOrigins = [
//             'http://localhost:5173',
//             'http://localhost:5174'
//         ];
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));



//db, redis connection
connectDB()
connectRedis()
//api endpoints

app.use('/api/v1/auth', AuthRouter);
// app.use('/api/v1/product', productRouter)
// app.use('/api/v1/otp', otpRouter);
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})