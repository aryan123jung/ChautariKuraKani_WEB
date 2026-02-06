import z, { email } from "zod";
import { UserSchema } from "../types/user.type";

export const CreateUserDto = UserSchema.pick(
    {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        profileUrl: true,
        coverUrl: true
    }
).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Password do not match",
        path: ['confirmPassword']
    }
)
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const LoginUserDto = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export type LoginUserDto = z.infer<typeof LoginUserDto>;

// export const UpdateUserDto = UserSchema.pick(
//     {
//         firstName: true,
//         lastName: true,
//         username: true,
//         email: true,
//     }
// )
// export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const UpdateUserDto = UserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;










// import z, { email } from "zod";
// import { UserSchema } from "../types/user.type";

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


// export const CreateUserDto = UserSchema.pick(
//     {
//         firstName: true,
//         lastName: true,
//         username: true,
//         email: true,
//         password: true,
//         confirmPassword: true,
//     }
// ).extend({
//     profileUrl: z
//       .instanceof(File)
//       .optional() // allow undefined
//       .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//         message: "Max file size is 5MB",
//       })
//       .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//         message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//       }),

//     coverUrl: z
//       .instanceof(File)
//       .optional() // allow undefined
//       .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//         message: "Max file size is 5MB",
//       })
//       .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//         message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//       }),
// })
// .refine(
//     (data) => data.password === data.confirmPassword,
//     {
//         message: "Password do not match",
//         path: ['confirmPassword']
//     }
// )
// export type CreateUserDto = z.infer<typeof CreateUserDto>;

// export const LoginUserDto = z.object({
//     email: z.email(),
//     password: z.string().min(6),
// });
// export type LoginUserDto = z.infer<typeof LoginUserDto>;

// // export const UpdateUserDto = UserSchema.pick(
// //     {
// //         firstName: true,
// //         lastName: true,
// //         username: true,
// //         email: true,
// //     }
// // )
// // export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

// export const UpdateUserDto = UserSchema.partial();
// export type UpdateUserDto = z.infer<typeof UpdateUserDto>;