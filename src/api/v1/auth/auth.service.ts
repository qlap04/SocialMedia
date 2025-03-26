import { redisClient } from '../../../shared/config/redis.config';
import User from '../auth/entities/user.entity';
import { errorResponse, successResponse } from '../common/response';
import { generateAndSendOtpService, verifyOtpService } from './otp.service';
import { MESSAGES, STATUS_CODES } from '../common/constants';
import { generateAccessToken, generateRefreshToken } from '../common/utils/token.util';
import { LoginUserDto, loginUserSchema } from './dto/loginUser.dto';
import { refreshTokenDto, refreshTokenSchema } from './dto/refreshToken.dto';
import { CreateUserDto, createUserSchema } from './dto/createUser.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../../../shared/config/env.config';
import mongoose from 'mongoose';
import Role from './entities/role.entity';

// Forgot Password: Request OTP
const forgotPasswordService = async (email: string) => {
    try {
        const response = await generateAndSendOtpService(email, 'reset'); // Use key prefix "reset"
        return response;
    } catch (error) {
        console.error('Error in forgot password service:', error);
        return errorResponse(MESSAGES.OTP_SEND_FAILED, null, null);
    }
};

// Forgot Password: Verify OTP
const verifyForgotPasswordOtpService = async (email: string, otp: string) => {
    try {
        const response = await verifyOtpService(email, otp, 'reset'); // 
        if (!response.success) {
            return errorResponse(MESSAGES.OTP_VERIFY_FAILED, response, STATUS_CODES.SERVER_ERROR);
        }
        return successResponse(MESSAGES.OTP_VERIFY_SUCCESS, null, null);
    } catch (error) {
        console.error('Error verifying OTP for forgot password:', error);
        return errorResponse(MESSAGES.OTP_VERIFY_FAILED, null, STATUS_CODES.SERVER_ERROR);
    }
};

// Reset Password
const resetPasswordService = async (email: string, otp: string, newPassword: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(MESSAGES.USER_NOT_FOUND, null, null);
        }

        const otpKey = `reset:${user._id}`;
        const storedOtp = await redisClient.get(otpKey);

        if (!storedOtp) {
            return errorResponse(MESSAGES.OTP_EXPIRED_OR_NOT_FOUND, null, null);
        }

        if (storedOtp !== otp) {
            return errorResponse(MESSAGES.OTP_VERIFY_FAILED, null, null);
        }

        // Hash pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // update
        user.password = hashedPassword;
        await user.save();

        // delete OTP in Redis
        await redisClient.del(otpKey);

        // delete refresh token (log out from all device)
        const refreshKey = `refresh:${user._id}`;
        await redisClient.del(refreshKey);

        return successResponse("Password has updated", null, null);
    } catch (error) {
        console.error('Error resetting password:', error);
        return errorResponse("Error resetting password:", null, STATUS_CODES.SERVER_ERROR);
    }
};


const refreshTokenService = async (data: refreshTokenDto) => {
    const tokenValidation = refreshTokenSchema.safeParse(data);
    if (!tokenValidation.success) return errorResponse(tokenValidation.error.errors[0].message, null, null);

    try {
        const decoded = jwt.verify(data.refresh_token, ENV.JWT_REFRESH_SECRET) as { id: string, roleId: number };
        const user = await User.findById(decoded.id);
        if (!user) return errorResponse(MESSAGES.USER_NOT_FOUND, null, null);

        const newAccessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
        return successResponse(MESSAGES.REFRESH_TOKEN_SUCCESS, { accessToken: newAccessToken }, STATUS_CODES.OK);
    } catch (error) {
        return errorResponse(MESSAGES.REFRESH_TOKEN_FAILED, null, STATUS_CODES.BAD_REQUEST);
    }
};

const registerUserService = async (data: CreateUserDto) => {
    const validation = createUserSchema.safeParse(data);
    if (!validation.success) {
        console.log(validation.error.errors);
        return errorResponse(validation.error.errors.map(err => err.message).join(', '), null, null);
    }

    const { username, email, password } = data;

    try {
        const exists = await User.findOne({ $or: [{ username }, { email }] });
        if (exists) {
            if (exists.username === username) {
                return errorResponse(MESSAGES.USERNAME_EXISTS, null, null);
            } else {
                return errorResponse(MESSAGES.EMAIL_EXISTS, null, null);
            }
        }
        const role = await Role.findOne({ roleId: 2 });
        if (!role) return errorResponse(MESSAGES.ROLE_NOT_FOUND, null, null);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            roleId: 2
        });

        const user = await newUser.save();

        const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ _id: user._id, roleId: user.roleId });

        return successResponse(MESSAGES.REGISTER_SUCCESS, { access_token: accessToken, refresh_token: refreshToken }, null);
    } catch (error) {
        return errorResponse(MESSAGES.REGISTER_FAILED, null, null);
    }
};

const loginUserService = async (data: LoginUserDto) => {
    const validation = loginUserSchema.safeParse(data);
    if (!validation.success) return errorResponse(validation.error.errors[0].message, null, null);

    const { username, password } = data;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return errorResponse(MESSAGES.INVALID_DATA, null, null);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(MESSAGES.INVALID_CREDENTIALS, null, null);
        }

        const refreshKey = `refresh:${user._id}`;
        const storedRefreshToken = await redisClient.get(refreshKey);

        if (storedRefreshToken) {
            const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
            return successResponse(MESSAGES.LOGIN_SUCCESS, {
                access_token: accessToken,
                refresh_token: storedRefreshToken,
            }, null);
        }

        const otpKey = `otp:${user._id}`;
        const storedOtp = await redisClient.get(otpKey);

        if (storedOtp) {
            return errorResponse(MESSAGES.OTP_ALREADY_SENT, null, null);
        }
        await generateAndSendOtpService(user.email);
        return errorResponse(MESSAGES.OTP_SENT, null, null);
    } catch (error) {
        console.error('Error logging in:', error);
        return errorResponse(MESSAGES.LOGIN_FAILED, null, null);
    }
};

const logoutUserService = async (dataId: string) => {
    const refreshKey = `refresh:${dataId}`;
    await redisClient.del(refreshKey);
    return successResponse(MESSAGES.LOG_OUT_SUCCESS, null, null);
};

export {
    generateAndSendOtpService,
    verifyOtpService,
    refreshTokenService,
    registerUserService,
    loginUserService,
    logoutUserService,
    forgotPasswordService,
    verifyForgotPasswordOtpService,
    resetPasswordService,
};