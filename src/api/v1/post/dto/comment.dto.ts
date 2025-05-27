import { z } from 'zod';

export const commentSchema = z.object({
    postId: z.string().trim().min(1, 'Post ID is required'),
    content: z.string().trim().min(1, 'Content is required'),
});

export type CommentDto = z.infer<typeof commentSchema>;