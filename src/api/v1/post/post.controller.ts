import { Request, Response } from 'express';
import { createPostService } from './post.service';
import { STATUS_CODES } from '../common/constants';

export const createPost = async (req: Request, res: Response) => {
    try {
        const data = {
            userId: req.body.userId,
            title: req.body.title,
        };
        const files = req.files as Express.Multer.File[];

        const response = await createPostService(data, files);
        if (response.success) {
            res.status(STATUS_CODES.CREATED).json(response);
        } else {
            res.status(STATUS_CODES.BAD_REQUEST).json(response);
        }
    } catch (error) {
        res.status(STATUS_CODES.SERVER_ERROR).json({ success: false, message: (error as Error).message });
    }
};

