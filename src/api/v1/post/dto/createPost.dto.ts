import { z } from 'zod';

export const createPostSchema = z.object({
    userId: z.string().trim().min(1, 'UserId is required'),
    title: z.string().min(1, 'Title must be filled'),
    status: z.enum(['private', 'friends', 'public']).default('public'), // Thêm status
});

export type CreatePostDto = z.infer<typeof createPostSchema>;