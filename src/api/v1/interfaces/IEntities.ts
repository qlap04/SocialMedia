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


export interface IContactRequest extends Document {
    receiverId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId[];
}

export interface ILike extends Document {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
}

export interface IPost {
    userId: mongoose.Types.ObjectId;
    title: string;
    media?: string[];
    status: 'private' | 'friends' | 'public';
    likesCount: number;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotification {
    userId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    type: 'LIKE' | 'COMMENT' | 'FRIEND_REQUEST';
    message: string;
    actionData?: any;
    isRead: boolean;
    createdAt: Date;
}
export interface IMessage {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
    createdAt: Date;
}