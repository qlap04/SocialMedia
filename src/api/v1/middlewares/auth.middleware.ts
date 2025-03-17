import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../../../shared/config/env.config';
import { IUser } from '../interfaces/IEntities';
import Role from '../auth/entities/role.entity';
import { errorResponse } from '../common/response';
import { MESSAGES, STATUS_CODES } from '../common/constants';



export interface CustomRequest extends Request {
    user?: IUser
    token?: string
}
export interface CustomResponse extends Response {
    roleId?: number
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.cookies.accessToken;

    if (!token) {
        res.status(401).json(errorResponse(MESSAGES.NO_TOKEN_PROVIDED, { status: STATUS_CODES.BAD_REQUEST }));
        return
    }

    jwt.verify(token, ENV.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            res.status(403).json(errorResponse(MESSAGES.INVALID_TOKEN, { status: STATUS_CODES.BAD_REQUEST }));
            return
        }
        req.user = user;
        next();
    });
};

const checkRole = (allowedRoles: number) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                res.status(401).json(errorResponse(MESSAGES.UNAUTHORIZED, { status: STATUS_CODES.BAD_REQUEST }));
                return
            }
            const role = await Role.findOne({ roleId: req.user.roleId });
            if (role.roleId !== allowedRoles) {
                res.status(403).json(errorResponse(MESSAGES.DONT_HAVE_PERMISSION, { status: STATUS_CODES.BAD_REQUEST }));
                return
            }

            next()
        } catch (error) {
            res.status(500).json(errorResponse(MESSAGES.CHECK_ROLE_FAIL, { status: STATUS_CODES.BAD_REQUEST }))
            return
        }
    }

};

export { authMiddleware, checkRole }