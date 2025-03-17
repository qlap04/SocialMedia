import { LoginUserDto, loginUserSchema } from './dto/loginUser.dto';
import { IUser } from "../interfaces/IEntities";
import User from "./entities/user.entity";
import Role from "./entities/role.entity";
import bcrypt from "bcryptjs"
import { successResponse, errorResponse } from "../common/response";
import { MESSAGES, STATUS_CODES } from "../common/constants"
import jwt from 'jsonwebtoken';
import { ENV } from '../../../shared/config/env.config'
import { refreshTokenDto, refreshTokenSchema } from "./dto/refreshToken.dto";
import { generateAccessToken, generateRefreshToken } from "../common/utils/token.util";
import { CreateUserDto, createUserSchema } from "./dto/createUser.dto";
import { redisClient } from '../../../shared/config/redis.config';
import { generateAndSendOtpService } from './otp.service';
import mongoose from 'mongoose';

//Authentication
export const refreshTokenService = async (data: refreshTokenDto) => {

    const tokenValidation = refreshTokenSchema.safeParse(data)
    if (!tokenValidation.success) return errorResponse(tokenValidation.error.errors[0].message, null)

    try {
        const decoded = jwt.verify(data.refresh_token, ENV.JWT_REFRESH_SECRET) as { id: string, roleId: number };
        const user = await User.findById(decoded.id);
        if (!user) return errorResponse(MESSAGES.USER_NOT_FOUND, null);

        const newAccessToken = await generateAccessToken(user)
        return successResponse(MESSAGES.REFRESH_TOKEN_SUCCESS, { accessToken: newAccessToken, status: STATUS_CODES.OK })
    } catch (error) {
        return errorResponse(MESSAGES.REFRESH_TOKEN_FAILED, { status: STATUS_CODES.BAD_REQUEST });
    }
};


//Register
export const registerUserService = async (data: CreateUserDto) => {
    const validation = createUserSchema.safeParse(data);
    if (!validation.success) {
        console.log(validation.error.errors);
        return errorResponse(validation.error.errors.map(err => err.message).join(', '), null)
    }

    const { username, email, password } = data;

    try {
        //Exception
        const exists = await User.findOne({ $or: [{ username }, { email }] });
        if (exists) {
            if (exists.username === username) {
                return errorResponse(MESSAGES.USERNAME_EXISTS, null);
            } else {
                return errorResponse(MESSAGES.EMAIL_EXISTS, null);
            }
        }
        const role = await Role.findOne({ roleId: 2 })
        if (!role) return errorResponse(MESSAGES.ROLE_NOT_FOUND, null); // default role when register:  Role (roleId 2)

        //hashPass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create User
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            roleId: 2
        })

        const user = await newUser.save();

        const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ _id: user._id, roleId: user.roleId });

        return successResponse(MESSAGES.REGISTER_SUCCESS, { access_token: accessToken, refresh_token: refreshToken, status: STATUS_CODES.CREATED });
    } catch (error) {
        return errorResponse(MESSAGES.REGISTER_FAILED, { status: STATUS_CODES.BAD_REQUEST });
    }
}

export const loginUserService = async (data: LoginUserDto) => {
    const validation = loginUserSchema.safeParse(data);
    if (!validation.success) return errorResponse(validation.error.errors[0].message, null)

    const { username, password } = data
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return errorResponse(MESSAGES.INVALID_DATA, null);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(MESSAGES.INVALID_CREDENTIALS, { status: STATUS_CODES.BAD_REQUEST });
        }

        // Trusted device feature by refreshToken
        const refreshKey = `refresh:${user._id}`;
        const storedRefreshToken = await redisClient.get(refreshKey);

        if (storedRefreshToken) {
            const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
            return successResponse(MESSAGES.LOGIN_SUCCESS, {
                access_token: accessToken,
                refresh_token: storedRefreshToken,
                status: STATUS_CODES.OK
            });
        }

        // OTP
        const otpKey = `otp:${user._id}`;
        const storedOtp = await redisClient.get(otpKey);

        if (storedOtp) {
            return errorResponse(MESSAGES.OTP_ALREADY_SENT, { status: STATUS_CODES.OK });
        }
        await generateAndSendOtpService(user.email);
        return errorResponse(MESSAGES.OTP_SENT, { status: STATUS_CODES.OK });

    } catch (error) {
        console.error('Error logging in:', error);
        return errorResponse(MESSAGES.LOGIN_FAILED, { status: STATUS_CODES.SERVER_ERROR })
    }
};

//// Logout
export const logoutUserService = async (dataId:  string) => {
    const refreshKey = `refresh:${dataId}`
    await redisClient.del(refreshKey);
    return successResponse(MESSAGES.LOG_OUT_SUCCESS, { status: STATUS_CODES.OK });
};
