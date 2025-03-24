import { z } from 'zod';
import mongoose from 'mongoose';
export const updatePostSchema = z.object({
    title: z.string().min(1, 'Content must be filled').optional(),
});
export type UpdatePostDto = z.infer<typeof updatePostSchema>;