import { ENV } from '../../../../shared/config/env.config'
import { IUser } from "../../interfaces/IEntities";
import Role from "../../auth/entities/role.entity";
import { errorResponse } from "../response";
import { MESSAGES } from "../constants"
import jwt from 'jsonwebtoken';


//generateToken
export const generateAccessToken = async (data: Partial<IUser>) => {
    const role = await Role.findOne({ roleId: data.roleId });
    if (!role) {
        throw new Error(MESSAGES.ROLE_NOT_FOUND);
    }
    return jwt.sign(
        { id: data._id, roleId: data.roleId },
        ENV.JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
    );
};


export const generateRefreshToken = async (data: Partial<IUser>): Promise<string> => {
    const role = await Role.findOne({ roleId: data.roleId });
    if (!role) {
        throw new Error(MESSAGES.ROLE_NOT_FOUND);
    }
    return jwt.sign(
        { id: data._id, roleId: data.roleId },
        ENV.JWT_REFRESH_SECRET,
        { expiresIn: '1h' }
    );
};