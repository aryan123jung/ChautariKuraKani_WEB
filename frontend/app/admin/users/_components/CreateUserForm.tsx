// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   adminCreateUserSchema,
//   AdminCreateUserData,
// } from "@/app/admin/schema";
// import { handleCreateUser } from "@/lib/actions/admin/user-action";
// import { toast } from "react-toastify";

// export default function CreateUserForm({
//   onCancel,
//   onSuccess,
// }: {
//   onCancel: () => void;
//   onSuccess: () => void;
// }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<AdminCreateUserData>({
//     resolver: zodResolver(adminCreateUserSchema),
//     defaultValues: { role: "user" },
//   });

//   const onSubmit = async (data: AdminCreateUserData) => {
//     const payload = {
//       firstName: data.firstName,
//       lastName: data.lastName,
//       username: data.username,
//       email: data.email,
//       password: data.password,
//       confirmPassword: data.confirmPassword,
//     };

//     const res = await handleCreateUser(payload);

//     if (!res.success) {
//       toast.error(res.message);
//       return;
//     }

//     toast.success("User created successfully!");
//     reset();
//     onSuccess();
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       {/* First Name */}
//       <div>
//         <input
//           {...register("firstName")}
//           placeholder="First Name"
//           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         />
//         {errors.firstName && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.firstName.message}
//           </p>
//         )}
//       </div>

//       {/* Last Name */}
//       <div>
//         <input
//           {...register("lastName")}
//           placeholder="Last Name"
//           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         />
//         {errors.lastName && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.lastName.message}
//           </p>
//         )}
//       </div>

//       {/* Email */}
//       <div>
//         <input
//           {...register("email")}
//           placeholder="Email"
//           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         />
//         {errors.email && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.email.message}
//           </p>
//         )}
//       </div>

//       {/* Username */}
//       <div>
//         <input
//           {...register("username")}
//           placeholder="Username"
//           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         />
//         {errors.username && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.username.message}
//           </p>
//         )}
//       </div>

//       {/* Password */}
//       <div>
//         <input
//           type="password"
//           {...register("password")}
//           placeholder="Password"
//           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         />
//         {errors.password && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.password.message}
//           </p>
//         )}
//       </div>

//       {/* Confirm Password */}
//       <div>
//         <input
//           type="password"
//           {...register("confirmPassword")}
//           placeholder="Confirm Password"
//           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         />
//         {errors.confirmPassword && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.confirmPassword.message}
//           </p>
//         )}
//       </div>

//       {/* Role */}
//       <div>
//         <select
//           {...register("role")}
//           className="w-full border border-gray-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
//         >
//           {isSubmitting ? "Creating..." : "Create User"}
//         </button>
//       </div>
//     </form>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminCreateUserSchema,
  AdminCreateUserData,
} from "@/app/admin/schema";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import { useState } from "react";

export default function CreateUserForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdminCreateUserData>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: { role: "user" },
  });

  
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  
  const handleFileChange = (field: "profileUrl" | "coverUrl", file?: File) => {
    setValue(field, file); 
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (field === "profileUrl") setProfilePreview(reader.result as string);
      else setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  
  const onSubmit = async (data: AdminCreateUserData) => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("role", data.role);

    if (data.profileUrl) formData.append("profileUrl", data.profileUrl);
    if (data.coverUrl) formData.append("coverUrl", data.coverUrl);

    const res = await handleCreateUser(formData);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("User created successfully!");
    reset();
    setProfilePreview(null);
    setCoverPreview(null);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* First Name */}
      <div>
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Username */}
      <div>
        <input
          {...register("username")}
          placeholder="Username"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block mb-1 font-medium">Profile Picture</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => handleFileChange("profileUrl", e.target.files?.[0])}
        />
        {errors.profileUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.profileUrl.message}</p>
        )}
        {profilePreview && (
          <img
            src={profilePreview}
            alt="Profile Preview"
            className="mt-2 w-24 h-24 object-cover rounded-full"
          />
        )}
      </div>

      {/* Cover Picture */}
      <div>
        <label className="block mb-1 font-medium">Cover Picture</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => handleFileChange("coverUrl", e.target.files?.[0])}
        />
        {errors.coverUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.coverUrl.message}</p>
        )}
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover Preview"
            className="mt-2 w-full h-32 object-cover rounded"
          />
        )}
      </div>

      {/* Role */}
      <div>
        <select
          {...register("role")}
          className="w-full border border-gray-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
