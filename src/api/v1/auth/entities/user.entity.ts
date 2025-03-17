// export interface IUser extends Document {
//     username: string;
//     email: string;
//     password: string;
//     roleId: number;
//     bio: string;
//     avatar: string;
//     isActive: boolean;
//     isPrivate: boolean;
//     lastActive: Date;
//     followers: mongoose.Types.ObjectId[];
//     followings: mongoose.Types.ObjectId[];
//     createdAt?: Date;
//     updatedAt?: Date;
// }

import { IUser } from "../../interfaces/IEntities";
import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    roleId: {
        type: Number,
        require: true,
    },
    bio: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now
    }, // Mặc định là thời điểm hiện tại
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
},
    {
        timestamps: true,
    }
)
const User = mongoose.model<IUser>('User', userSchema);

export default User;