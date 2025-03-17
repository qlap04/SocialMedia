import nodemailer from 'nodemailer';
import { ENV } from '../../../../shared/config/env.config';

export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email OTP 
export const sendOtpEmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENV.EMAIL_MAIN,
            pass: ENV.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: ENV.EMAIL_MAIN,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP is ${otp}. It expires in 300 seconds.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};