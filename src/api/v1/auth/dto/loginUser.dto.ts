// dto/user.dto.ts
import { z } from 'zod';

export const loginUserSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;