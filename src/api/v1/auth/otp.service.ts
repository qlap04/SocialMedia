import { redisClient } from '../../../shared/config/redis.config';
import User from '../auth/entities/user.entity'
import { errorResponse, successResponse, ApiResponse } from '../common/response';
import { generateOtp, sendOtpEmail } from './../common/utils/otp.util';
import { MESSAGES, STATUS_CODES } from '../common/constants';
import { generateAccessToken, generateRefreshToken } from '../common/utils/token.util';


// Generate and Send OTP 
const generateAndSendOtpService = async (email: string, redisKeyPrefix: string = 'otp') => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return { success: false, message: 'User not found', status: 404 };
        }

        const otp = generateOtp();
        const otpExpiryInSeconds = 300;

        const redisKey = `${redisKeyPrefix}:${user._id}`; // Key dạng prefix:userId (otp:userId hoặc reset:userId)
        await redisClient.setEx(redisKey, otpExpiryInSeconds, otp);

        // SendOTP
        await sendOtpEmail(user.email, otp);

        return successResponse(MESSAGES.OTP_SEND_SUCCESS, null, null);
    } catch (error) {
        console.error('Error generating and sending OTP:', error);
        return errorResponse(MESSAGES.OTP_SEND_FAILED, null, null);
    }
};

// Verify OTP 
const verifyOtpService = async (email: string, otp: string, redisKeyPrefix: string = 'otp') => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(MESSAGES.USER_NOT_FOUND, null, null);
        }

        const otpKey = `${redisKeyPrefix}:${user._id}`;
        const storedOtp = await redisClient.get(otpKey);

        if (!storedOtp) {
            return errorResponse(MESSAGES.OTP_EXPIRED_OR_NOT_FOUND, null, null);
        }

        if (storedOtp !== otp) {
            return errorResponse(MESSAGES.OTP_VERIFY_FAILED, null, null);
        }

        await redisClient.del(otpKey);

        const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ _id: user._id, roleId: user.roleId });

        const refreshKey = `refresh:${user._id}`;
        await redisClient.setEx(refreshKey, 7 * 24 * 60 * 60, refreshToken);
        return successResponse(MESSAGES.OTP_VERIFY_SUCCESS, { access_token: accessToken, refresh_token: refreshToken }, null);
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return errorResponse(MESSAGES.OTP_VERIFY_FAILED, null, STATUS_CODES.SERVER_ERROR);
    }
};

export {
    generateAndSendOtpService,
    verifyOtpService,
};