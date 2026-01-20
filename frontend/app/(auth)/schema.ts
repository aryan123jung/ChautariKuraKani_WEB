import z from "zod";

export const loginSchema = z.object({
    email: z.email({message: "Enter a valid email"}),
    password: z.string().min(6, {message: "Minimum 6 characters"})
});
export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    firstName : z.string().min(1,{message: "Enter a first name"}),
    lastName: z.string().min(1,{message: "Enter your last name"}),
    email: z.email({message: "Enter a valid email"}),
    username: z.string().min(3, {message: "Minimun 3 characters"}),
    password: z.string().min(6,{message: "Minimum 6 characters"}),
    confirmPassword: z.string().min(6,{message: "Minimum 6 characters"}),
}).refine((v) => v.password === v.confirmPassword, {
    path:["confirmPassword"],
    message:"Password do not match"
});
export type RegisterData = z.infer<typeof registerSchema>;