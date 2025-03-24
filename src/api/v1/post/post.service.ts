import Post from "./entities/post.entity";
import User from "../auth/entities/user.entity";
import { IPost } from "../interfaces/IEntities";
import fs from 'fs/promises';
import { CreatePostDto, createPostSchema } from "./dto/createPost.dto";
import { errorResponse, successResponse } from "../common/response";
import { MESSAGES, STATUS_CODES } from "../common/constants";
import { uploadToCloudinary } from '../common/utils/cloudinary.util';

export const createPostService = async (data: CreatePostDto, files: Express.Multer.File[]) => {
    const dataValidation = createPostSchema.safeParse(data);
    if (!dataValidation.success) return errorResponse(dataValidation.error.errors[0].message, null, null);

    const user = await User.findById(data.userId);
    if (!user) {
        return errorResponse('User not found', null, 404);
    }
    try {
        if (!files || files.length === 0) {
            return errorResponse(MESSAGES.NOTHING_UPLOAD, null, null);
        }
        if (files.length > 5) {
            return errorResponse(MESSAGES.MAX_FILE, null, null);
        }

        const mediaUrls = await Promise.all(
            files.map(async (file) => {
                const url = await uploadToCloudinary(file.path);
                await fs.unlink(file.path);
                return url;
            })
        );

        // Kiểm tra mediaUrls
        if (mediaUrls.some(url => !url)) {
            return errorResponse('Failed to upload one or more files to Cloudinary', null, null);
        }

        const post = new Post({
            userId: data.userId,
            title: data.title,
            media_url: mediaUrls,
            commentList: [],
            likeList: [],
        });

        const savedPost = await post.save();
        return successResponse('Post created', savedPost, 201);
    } catch (error) {
        await Promise.all(files.map(file => fs.unlink(file.path).catch(() => { })));
        return errorResponse(error.message || 'Internal server error', null, null);
    }
};