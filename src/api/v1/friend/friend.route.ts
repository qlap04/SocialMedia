import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendList, unfriend, getFriendRequests } from './friend.controller';

const friendRouter = express.Router();

friendRouter.post('/send', authMiddleware, sendFriendRequest);
friendRouter.post('/accept/:requestId', authMiddleware, acceptFriendRequest);
friendRouter.post('/reject/:requestId', authMiddleware, rejectFriendRequest);
friendRouter.get('/list', authMiddleware, getFriendList);
friendRouter.delete('/unfriend/:friendId', authMiddleware, unfriend);
friendRouter.get('/requests', authMiddleware, getFriendRequests);

export default friendRouter;