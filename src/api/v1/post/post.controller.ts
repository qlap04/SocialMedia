import { Request, Response } from 'express';
import { createPostService } from './post.service';
import { STATUS_CODES } from '../common/constants';
import { CustomRequest } from '../middlewares/auth.middleware';

export const createPost = async (req: CustomRequest, res: Response) => {
    try {
        const data = {
            userId: req.body.userId,
            title: req.body.title,
            status: req.body.status,
        };
        const files = req.files as Express.Multer.File[];

        const response = await createPostService(data, files);
        res.status(response.status || STATUS_CODES.OK).json(response);
    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).json({ success: false, message: (error as Error).message });
    }
};