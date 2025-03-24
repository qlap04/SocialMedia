import { z } from 'zod';

export const createPostSchema = z.object({
    userId: z.string().trim().min(1, 'UserId is required'),
    title: z.string().min(1, 'Content must be filled'),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;