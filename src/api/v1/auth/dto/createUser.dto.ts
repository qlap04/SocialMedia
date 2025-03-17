// dto/user.dto.ts
import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;