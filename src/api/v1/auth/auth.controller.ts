import { Request, Response } from "express";
import {
    registerUserService,
    loginUserService,
    refreshTokenService,
    logoutUserService,
    forgotPasswordService,
    verifyForgotPasswordOtpService,
    resetPasswordService,
} from "./auth.service";

import { generateAndSendOtpService, verifyOtpService } from "./otp.service";
import { MESSAGES, STATUS_CODES } from "../common/constants";
import { CreateUserDto } from "./dto/createUser.dto";
import { COOKIE_OPTIONS } from "../common/utils/cookieOption.util";
import { errorResponse } from "../common/response";
import { LoginUserDto } from "./dto/loginUser.dto";
import User from "./entities/user.entity";
import mongoose from "mongoose";

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const registerData: CreateUserDto = req.body
        const response = await registerUserService(registerData)
        if (response.success) {
            res.cookie('accessToken', response.data.access_token, COOKIE_OPTIONS);
            res.cookie('refreshToken', response.data.refresh_token, COOKIE_OPTIONS);
            res.status(STATUS_CODES.CREATED).json(response);
            return
        }

    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message, null, STATUS_CODES.SERVER_ERROR))
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const loginData: LoginUserDto = req.body
        const response = await loginUserService(loginData);

        if (response.success) {
            res.cookie('accessToken', response.data.access_token, COOKIE_OPTIONS);
            res.cookie('refreshToken', response.data.refresh_token, COOKIE_OPTIONS);
            res.status(STATUS_CODES.OK).json(response);
            return
        }
        res.status(STATUS_CODES.BAD_REQUEST).json(response);
        return
    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).json(errorResponse((error as Error).message, null, STATUS_CODES.SERVER_ERROR))
    }
};

export const refreshTokenController = async (req: Request, res: Response) => {
    const { refresh_token } = req.body; // Lấy từ body
    console.log('Refresh token from body:', refresh_token);

    const response = await refreshTokenService({ refresh_token }); // Truyền object đúng định dạng

    if (response.success) {
        res.cookie('accessToken', response.data.accessToken, COOKIE_OPTIONS);
        res.status(STATUS_CODES.CREATED).json(response);
        return;
    }
    res.status(STATUS_CODES.BAD_REQUEST).json(response);
    return;
};

export const logoutUserController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        const logoutData: string = req.params.id
        const response = await logoutUserService(logoutData);
        res.status(STATUS_CODES.OK).json(response);
        return
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: (error as Error).message });
    }
};

// OTP: Send OTP endpoint
export const verifyOtpController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json(errorResponse("Email and OTP are required", null, STATUS_CODES.BAD_REQUEST));
            return
        }
        const response = await verifyOtpService(email, otp);
        if (response.success) {
            res.cookie('accessToken', response.data.access_token, COOKIE_OPTIONS);
            res.cookie('refreshToken', response.data.refresh_token, COOKIE_OPTIONS);
            res.status(STATUS_CODES.OK).json(response);
            return
        }
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message, null, STATUS_CODES.SERVER_ERROR));
    }
};

// Forgot Password: Request OTP
export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json(errorResponse("Email is required", null, STATUS_CODES.BAD_REQUEST));
            return;
        }

        const response = await forgotPasswordService(email);
        res.status(response.status || STATUS_CODES.OK).json(response);
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message, null, STATUS_CODES.SERVER_ERROR));
    }
};

// Forgot Password: Verify OTP
export const verifyForgotPasswordOtpController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json(errorResponse("Email and OTP are required", null, STATUS_CODES.BAD_REQUEST));
            return;
        }

        const response = await verifyForgotPasswordOtpService(email, otp);
        res.status(response.status || STATUS_CODES.OK).json(response);
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message, null, STATUS_CODES.SERVER_ERROR));
    }
};

// Forgot Password: Reset Password
export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            res.status(400).json(errorResponse("Email, OTP, and new password are required", null, STATUS_CODES.BAD_REQUEST));
            return;
        }

        const response = await resetPasswordService(email, otp, newPassword);
        res.status(response.status || STATUS_CODES.OK).json(response);
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message, null, STATUS_CODES.SERVER_ERROR));
    }
};