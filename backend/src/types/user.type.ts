import z, { email } from "zod";

export const UserSchema = z.object({
    // firstName: z.string().optional(),
    firstName: z.string(),
    // lastName: z.string().optional(),
    lastName: z.string(),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    username: z.string().min(3),
    role: z.enum(['user','admin']).default('user'),
    profileUrl: z.string().optional(),
    coverUrl: z.string().optional()
});

export type UserType = z.infer<typeof UserSchema>;