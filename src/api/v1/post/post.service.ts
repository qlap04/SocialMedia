import Post from './entities/post.entity';
import User from '../auth/entities/user.entity';
import { errorResponse, successResponse } from '../common/response';
import { MESSAGES, STATUS_CODES } from '../common/constants';
import { CreatePostDto, createPostSchema } from './dto/createPost.dto';
import { uploadToCloudinary } from '../common/utils/cloudinary.util';
import fs from 'fs/promises';

export const createPostService = async (data: CreatePostDto, files?: Express.Multer.File[]) => {
    const dataValidation = createPostSchema.safeParse(data);
    if (!dataValidation.success) {
        return errorResponse(dataValidation.error.errors[0].message, null, STATUS_CODES.BAD_REQUEST);
    }

    const { userId, title, status } = data;

    const user = await User.findById(userId);
    if (!user) {
        return errorResponse('User not found', null, STATUS_CODES.BAD_REQUEST);
    }

    try {
        let mediaUrls: string[] = [];
        if (files && files.length > 0) {
            if (files.length > 5) {
                return errorResponse(MESSAGES.MAX_FILE, null, STATUS_CODES.BAD_REQUEST);
            }
            mediaUrls = await Promise.all(
                files.map(async (file) => {
                    const url = await uploadToCloudinary(file.path);
                    await fs.unlink(file.path);
                    return url;
                })
            );

            if (mediaUrls.some((url) => !url)) {
                return errorResponse('Failed to upload one or more files to Cloudinary', null, STATUS_CODES.BAD_REQUEST);
            }
        }

        const post = new Post({
            userId,
            title,
            media: mediaUrls,
            status,
        });

        const savedPost = await post.save();
        return successResponse('Post created', savedPost, STATUS_CODES.CREATED);
    } catch (error) {
        if (files) {
            await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => { })));
        }
        return errorResponse(error.message || 'Internal server error', null, STATUS_CODES.SERVER_ERROR);
    }
};