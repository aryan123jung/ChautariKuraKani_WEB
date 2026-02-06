// import z from "zod";
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// export const adminCreateUserSchema = z.object({
//   firstName : z.string().min(1,{message: "Enter a first name"}),
//       lastName: z.string().min(1,{message: "Enter your last name"}),
//       email: z.email({message: "Enter a valid email"}),
//       username: z.string().min(3, {message: "Minimun 3 characters"}),
//       password: z.string().min(6,{message: "Minimum 6 characters"}),
//       confirmPassword: z.string().min(6,{message: "Minimum 6 characters"}),
//       role: z.enum(["user", "admin"]),
//        profileUrl: z
//           .instanceof(File)
//           .optional()
//           .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//               message: "Max file size is 5MB",
//           })
//           .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//               message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//           }),
//       coverUrl: z
//           .instanceof(File)
//           .optional()
//           .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//               message: "Max file size is 5MB",
//           })
//           .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//               message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//           }),
//   }).refine((v) => v.password === v.confirmPassword, {
//       path:["confirmPassword"],
//       message:"Password do not match"
  
// });
// export type AdminCreateUserData = z.infer<typeof adminCreateUserSchema>;


// export const adminUpdateUserSchema = z.object({
//   firstName: z.string().min(2, { message: "Minimum 2 characters" }),
//       lastName: z.string().min(2, { message: "Minimum 2 characters" }),
//       email: z.string(),
//       username: z.string().min(3, { message: "Minimum 3 characters" }),
//       profileUrl: z
//           .instanceof(File)
//           .optional()
//           .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//               message: "Max file size is 5MB",
//           })
//           .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//               message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//           }),
//       coverUrl: z
//           .instanceof(File)
//           .optional()
//           .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//               message: "Max file size is 5MB",
//           })
//           .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//               message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//           }),
//   role: z.enum(["user", "admin"]).optional(),
// });
// export type AdminUpdateUserData = z.infer<typeof adminUpdateUserSchema>;


// export const adminResetPasswordSchema = z.object({
//   password: z.string().min(6, "Minimum 6 characters"),
// });

// export type AdminResetPasswordData = z.infer<typeof adminResetPasswordSchema>;










// import z from "zod";

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// export const adminCreateUserSchema = z
//   .object({
//     firstName: z.string().min(1, { message: "Enter a first name" }),
//     lastName: z.string().min(1, { message: "Enter your last name" }),
//     email: z.string().email({ message: "Enter a valid email" }),
//     username: z.string().min(3, { message: "Minimum 3 characters" }),
//     password: z.string().min(6, { message: "Minimum 6 characters" }),
//     confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
//     role: z.enum(["user", "admin"]),
//     profileUrl: z
//         .instanceof(File)
//         .optional()
//         .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//             message: "Max file size is 5MB",
//         })
//         .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//             message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//         }),
//     coverUrl: z
//         .instanceof(File)
//         .optional()
//         .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
//             message: "Max file size is 5MB",
//         })
//         .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
//             message: "Only .jpg, .jpeg, .png and .webp formats are supported",
//         }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Passwords do not match",
//   });

// export type AdminCreateUserData = z.infer<typeof adminCreateUserSchema>;
import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const adminCreateUserSchema = z
  .object({
    firstName: z.string().min(1, { message: "Enter a first name" }),
    lastName: z.string().min(1, { message: "Enter your last name" }),
    email: z.string().email({ message: "Enter a valid email" }),
    username: z.string().min(3, { message: "Minimum 3 characters" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    role: z.enum(["user", "admin"]),

    profileUrl: z
      .instanceof(File)
      .optional() 
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "Max file size is 5MB",
      })
      .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      }),

    coverUrl: z
      .instanceof(File)
      .optional() 
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "Max file size is 5MB",
      })
      .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type AdminCreateUserData = z.infer<typeof adminCreateUserSchema>;

