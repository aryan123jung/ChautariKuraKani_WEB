

// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   adminCreateUserSchema,
//   AdminCreateUserData,
// } from "@/app/admin/schema";
// import { handleCreateUser } from "@/lib/actions/admin/user-action";
// import { toast } from "react-toastify";
// import { useState } from "react";

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
//     setValue,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<AdminCreateUserData>({
//     resolver: zodResolver(adminCreateUserSchema),
//     defaultValues: { role: "user" },
//   });

  
//   const [profilePreview, setProfilePreview] = useState<string | null>(null);
//   const [coverPreview, setCoverPreview] = useState<string | null>(null);

  
//   const handleFileChange = (field: "profileUrl" | "coverUrl", file?: File) => {
//     setValue(field, file); 
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       if (field === "profileUrl") setProfilePreview(reader.result as string);
//       else setCoverPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

  
//   const onSubmit = async (data: AdminCreateUserData) => {
//     const formData = new FormData();

//     formData.append("firstName", data.firstName);
//     formData.append("lastName", data.lastName);
//     formData.append("username", data.username);
//     formData.append("email", data.email);
//     formData.append("password", data.password);
//     formData.append("confirmPassword", data.confirmPassword);
//     formData.append("role", data.role);

//     if (data.profileUrl) formData.append("profileUrl", data.profileUrl);
//     if (data.coverUrl) formData.append("coverUrl", data.coverUrl);

//     const res = await handleCreateUser(formData);

//     if (!res.success) {
//       toast.error(res.message);
//       return;
//     }

//     toast.success("User created successfully!");
//     reset();
//     setProfilePreview(null);
//     setCoverPreview(null);
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
//           <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
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
//           <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
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
//           <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
//           <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
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
//           <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
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
//           <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
//         )}
//       </div>

//       {/* Profile Picture */}
//       <div>
//         <label className="block mb-1 font-medium">Profile Picture</label>
//         <input
//           type="file"
//           accept=".jpg,.jpeg,.png,.webp"
//           onChange={(e) => handleFileChange("profileUrl", e.target.files?.[0])}
//         />
//         {errors.profileUrl && (
//           <p className="text-red-500 text-sm mt-1">{errors.profileUrl.message}</p>
//         )}
//         {profilePreview && (
//           <img
//             src={profilePreview}
//             alt="Profile Preview"
//             className="mt-2 w-24 h-24 object-cover rounded-full"
//           />
//         )}
//       </div>

//       {/* Cover Picture */}
//       <div>
//         <label className="block mb-1 font-medium">Cover Picture</label>
//         <input
//           type="file"
//           accept=".jpg,.jpeg,.png,.webp"
//           onChange={(e) => handleFileChange("coverUrl", e.target.files?.[0])}
//         />
//         {errors.coverUrl && (
//           <p className="text-red-500 text-sm mt-1">{errors.coverUrl.message}</p>
//         )}
//         {coverPreview && (
//           <img
//             src={coverPreview}
//             alt="Cover Preview"
//             className="mt-2 w-full h-32 object-cover rounded"
//           />
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
import { Camera, X, Loader2, Upload, Image as ImageIcon } from "lucide-react";

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
  const [profileFileName, setProfileFileName] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);

  const handleFileChange = (field: "profileUrl" | "coverUrl", file?: File) => {
    setValue(field, file);
    if (!file) {
      if (field === "profileUrl") {
        setProfilePreview(null);
        setProfileFileName(null);
      } else {
        setCoverPreview(null);
        setCoverFileName(null);
      }
      return;
    }

    if (field === "profileUrl") {
      setProfileFileName(file.name);
    } else {
      setCoverFileName(file.name);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (field === "profileUrl") {
        setProfilePreview(reader.result as string);
      } else {
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (field: "profileUrl" | "coverUrl", e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(field, undefined);
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
    setProfileFileName(null);
    setCoverFileName(null);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      {/* <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Create New User</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the information below to create a new user account
        </p>
      </div> */}

      {/* Cover Image Upload - Full Width */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Cover Image
        </label>
        <div className="relative group">
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-all">
            {coverPreview ? (
              <>
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => clearFile("coverUrl", e)}
                  className="absolute top-3 right-3 p-1.5 bg-gray-900 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <p className="mt-2 text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                  Upload cover image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Recommended size: 1200 x 300px
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange("coverUrl", e.target.files?.[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          {coverFileName && (
            <p className="mt-1 text-xs text-gray-500 truncate">
              Selected: {coverFileName}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image - Left Column */}
        <div className="md:col-span-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="relative group inline-block">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <label className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("profileUrl", e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  {profilePreview && (
                    <button
                      type="button"
                      onClick={(e) => clearFile("profileUrl", e)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {profileFileName && (
                <p className="mt-2 text-xs text-gray-500 truncate max-w-[128px]">
                  {profileFileName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields - Right Column */}
        <div className="md:col-span-2 space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstName")}
                placeholder="John"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName")}
                placeholder="Doe"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="john.doe@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              {...register("username")}
              placeholder="johndoe"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              User Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Footer */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}