import { Router } from "express";
import {
    registerUserController,
    loginUserController,
    refreshTokenController,
    logoutUserController,
    verifyOtpController,
    forgotPasswordController,
    verifyForgotPasswordOtpController,
    resetPasswordController,
} from "./auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const AuthRouter = Router();

AuthRouter.post("/register", registerUserController);
AuthRouter.post("/login", loginUserController);
AuthRouter.post("/refresh", refreshTokenController);
AuthRouter.post("/logout", logoutUserController);

// OTP routes
AuthRouter.post("/otp/verify", (req, res, next) => {
    verifyOtpController(req, res).catch(next);
});

// Forgot Password routes
AuthRouter.post("/forgot-password", forgotPasswordController);
AuthRouter.post("/reset-password/verify", verifyForgotPasswordOtpController);
AuthRouter.post("/reset-password", resetPasswordController);

export default AuthRouter;