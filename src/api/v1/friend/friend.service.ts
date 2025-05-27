import Friendship from './entities/friendship.entity';
import mongoose from 'mongoose';
import Contact from './entities/contact.entity';
import { errorResponse, successResponse } from '../common/response';
import { MESSAGES, STATUS_CODES } from '../common/constants';
import { IFriendship, IContactRequest } from '../interfaces/IEntities';
import { IPost } from '../interfaces/IEntities';

export const sendFriendRequestService = async (senderId: string, receiverId: string) => {
    try {
        if (senderId === receiverId) {
            return errorResponse('Cannot send friend request to yourself', null, STATUS_CODES.BAD_REQUEST);
        }

        // check existed in friendList
        const senderFriendship = await Friendship.findOne({ userId: senderId });
        if (senderFriendship && senderFriendship.friendList.some(id => id.toString() === receiverId)) {
            return errorResponse('You are already friends', null, STATUS_CODES.BAD_REQUEST);
        }

        // check existed request
        const existingRequest = await Contact.findOne({ senderId, receiverId });
        if (existingRequest) {
            return errorResponse('Friend request already sent', null, STATUS_CODES.BAD_REQUEST);
        }

        // create request
        const request = new Contact({
            senderId,
            receiverId,
        });

        await request.save();
        return successResponse('Friend request sent', null, STATUS_CODES.OK);
    } catch (error) {
        return errorResponse(error.message || 'Internal server error', null, STATUS_CODES.SERVER_ERROR);
    }
}

export const acceptFriendRequestService = async (userId: string, requestId: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return errorResponse('Invalid requestId', null, STATUS_CODES.BAD_REQUEST);
        }

        const request = await Contact.findById(requestId);
        if (!request) {
            return errorResponse('Friend request not found', null, STATUS_CODES.BAD_REQUEST);
        }

        // userId is receiver
        if (request.receiverId.toString() !== userId) {
            return errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST);
        }

        const senderId = request.senderId.toString();
        const receiverId = request.receiverId.toString();

        // add friendList 
        await Friendship.updateOne(
            { userId: senderId },
            { $addToSet: { friendList: receiverId } },
            { upsert: true }
        );

        await Friendship.updateOne(
            { userId: receiverId },
            { $addToSet: { friendList: senderId } },
            { upsert: true }
        );

        // Delete
        await Contact.deleteOne({ _id: requestId });

        return successResponse('Friend request accepted', null, STATUS_CODES.OK);
    } catch (error) {
        return errorResponse(error.message || 'Internal server error', null, STATUS_CODES.SERVER_ERROR);
    }
}

export const rejectFriendRequestService = async (userId: string, requestId: string) => {
    try {
        // 
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return errorResponse('Invalid requestId', null, STATUS_CODES.BAD_REQUEST);
        }

        const request = await Contact.findById(requestId);
        if (!request) {
            return errorResponse('Friend request not found', null, STATUS_CODES.BAD_REQUEST);
        }

        // 
        if (request.receiverId.toString() !== userId) {
            return errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST);
        }

        // 
        await Contact.deleteOne({ _id: requestId });

        return successResponse('Friend request rejected', null, STATUS_CODES.OK);
    } catch (error) {
        return errorResponse(error.message || 'Internal server error', null, STATUS_CODES.SERVER_ERROR);
    }
}

export const getFriendListService = async (userId: string, page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;
        const friendship = await Friendship.findOne({ userId })
            .populate({
                path: 'friendList',
                select: 'username email',
                options: { skip, limit },
            });
        if (!friendship) {
            return successResponse('Friend list retrieved', [], STATUS_CODES.OK);
        }
        return successResponse('Friend list retrieved', friendship.friendList, STATUS_CODES.OK);
    } catch (error) {
        return errorResponse(error.message || 'Internal server error', null, STATUS_CODES.SERVER_ERROR);
    }
};

export const unfriendService = async (userId: string, friendId: string) => {
    try {
        //
        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            return errorResponse('Invalid friendId', null, STATUS_CODES.BAD_REQUEST);
        }

        // 
        const userFriendship = await Friendship.findOne({ userId });
        if (!userFriendship || !userFriendship.friendList.some(id => id.toString() === friendId)) {
            return errorResponse('You are not friends', null, STATUS_CODES.BAD_REQUEST);
        }

        // 
        await Friendship.updateOne(
            { userId },
            { $pull: { friendList: friendId } }
        );

        // 
        await Friendship.updateOne(
            { userId: friendId },
            { $pull: { friendList: userId } }
        );

        return successResponse('Unfriended successfully', null, STATUS_CODES.OK);
    } catch (error) {
        return errorResponse(error.message || 'Internal server error', null, STATUS_CODES.SERVER_ERROR);
    }
}


export const getFriendRequestsService = async (userId: string) => {
    try {
        const requests = await Contact.find({ receiverId: userId })
            .populate('senderId', 'username email');
        return successResponse('Friend requests retrieved', requests, STATUS_CODES.OK);
    } catch (error) {
        return errorResponse(error.message || 'Internal server error', null, STATUS_CODES.SERVER_ERROR);
    }
}


export const canInteractWithPost = async (userId: string, post: IPost): Promise<boolean> => {
    // Nếu bài viết là public, ai cũng có thể tương tác
    if (post.status === 'public') {
        return true;
    }

    // Nếu bài viết là private, chỉ người tạo mới có thể tương tác
    if (post.status === 'private') {
        return userId === post.userId.toString();
    }

    // Nếu bài viết là friends, chỉ bạn bè hoặc người tạo mới có thể tương tác
    if (post.status === 'friends') {
        if (userId === post.userId.toString()) {
            return true;
        }
        const friendship = await Friendship.findOne({ userId: post.userId });
        if (!friendship) {
            return false;
        }
        return friendship.friendList.some((friendId) => friendId.toString() === userId);
    }

    return false;
};