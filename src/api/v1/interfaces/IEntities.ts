import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

//User
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    roleId: number;
    bio: string;
    avatar: string;
    isActive: boolean;
    isPrivate: boolean;
    lastActive: Date;
    followers: mongoose.Types.ObjectId[];
    followings: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

//Role
export interface IRole extends Document {
    roleName: string;
    roleId: number; // 1: admin, 2: user
}

//FriendShip
export interface IFriendship extends Document {
    userId: mongoose.Types.ObjectId;
    friendList: mongoose.Types.ObjectId[];
}

export interface IBlockList extends Document {
    userId: mongoose.Types.ObjectId;
    friendList: mongoose.Types.ObjectId[];
}

export interface IContactRequest extends Document {
    receiverId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId[];
}

export interface ILikeList extends Document {
    userId: mongoose.Types.ObjectId;
    postList: mongoose.Types.ObjectId[];
    reelList: mongoose.Types.ObjectId[];
}

export interface IPost extends Document {
    title: string;
    type: string;
    media_url: string[]
    commentList: mongoose.Types.ObjectId[];
    likeList: mongoose.Types.ObjectId[];
}

export interface IComment extends Document {
    content: string;
    likeList: mongoose.Types.ObjectId[]
}

export interface IMessage extends Document {
    receiverId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId[];
}