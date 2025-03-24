import express from 'express';
import { createPost } from './post.controller';
import uploadMulter from '../middlewares/multer.middleware';
import { authMiddleware } from "../middlewares/auth.middleware";
const postRouter = express.Router();

postRouter.post('/create', authMiddleware, uploadMulter.array('media', 5), createPost);

export default postRouter;