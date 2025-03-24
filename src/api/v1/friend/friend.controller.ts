import { Request, Response } from 'express';
import { errorResponse } from '../common/response';
import { sendFriendRequestService, acceptFriendRequestService, rejectFriendRequestService, getFriendListService, unfriendService, getFriendRequestsService } from './friend.service';
import { CustomRequest } from '../middlewares/auth.middleware';
import { STATUS_CODES } from '../common/constants';

export const sendFriendRequest = async (req: CustomRequest, res: Response) => {

    if (!req.user || !req.user.id) {
        res.status(401).json(errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST));
        return
    }
    const senderId = req.user.id;
    const { receiverId } = req.body;

    try {
        const response = await sendFriendRequestService(senderId, receiverId);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json(errorResponse(error.message || 'Internal server error', null, 500));
    }
}

export const acceptFriendRequest = async (req: CustomRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json(errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST));
        return
    }
    const userId = req.user?.id;
    const { requestId } = req.params;

    try {
        const response = await acceptFriendRequestService(userId, requestId);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json(errorResponse(error.message || 'Internal server error', null, 500));
    }
}

export const rejectFriendRequest = async (req: CustomRequest, res: Response) => {

    if (!req.user || !req.user.id) {
        res.status(401).json(errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST));
        return
    }

    const userId = req.user?.id;
    const { requestId } = req.params;

    try {
        const response = await rejectFriendRequestService(userId, requestId);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json(errorResponse(error.message || 'Internal server error', null, 500));
    }
}

export const getFriendList = async (req: CustomRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json(errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST));
        return
    }

    const userId = req.user?.id;

    try {
        const response = await getFriendListService(userId);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json(errorResponse(error.message || 'Internal server error', null, 500));
    }
}

export const unfriend = async (req: CustomRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json(errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST));
        return
    }

    const userId = req.user?.id;
    const { friendId } = req.params;

    try {
        const response = await unfriendService(userId, friendId);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json(errorResponse(error.message || 'Internal server error', null, 500));
    }
}

export const getFriendRequests = async (req: CustomRequest, res: Response) => {
    if (!req.user || !req.user.id) {
        res.status(401).json(errorResponse('Unauthorized', null, STATUS_CODES.BAD_REQUEST));
        return
    }

    const userId = req.user?.id;

    try {
        const response = await getFriendRequestsService(userId);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json(errorResponse(error.message || 'Internal server error', null, 500));
    }
}