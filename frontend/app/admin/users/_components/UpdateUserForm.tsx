


// "use client";

// import { useState, useTransition } from "react";
// import { handleUpdateUser } from "@/lib/actions/admin/user-action";
// import { toast } from "react-toastify";
// import { Camera, X, Loader2, Upload, Image as ImageIcon, Save } from "lucide-react";

// interface UpdateUserFormProps {
//   user: any;
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// export default function UpdateUserForm({ user, onSuccess, onCancel }: UpdateUserFormProps) {
//   const backendUrl = process.env.NEXT_PUBLIC_API_URL;
//   const [isPending, startTransition] = useTransition();

//   const [formState, setFormState] = useState({
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     email: user.email || "",
//     username: user.username || "",
//     role: user.role || "user",
//     profileUrl: undefined as File | string | undefined,
//     coverUrl: undefined as File | string | undefined,
//   });

//   // Preview URLs
//   const profilePreview = formState.profileUrl
//     ? formState.profileUrl instanceof File
//       ? URL.createObjectURL(formState.profileUrl)
//       : `${backendUrl}/uploads/profile/${formState.profileUrl}`
//     : user.profileUrl
//     ? `${backendUrl}/uploads/profile/${user.profileUrl}`
//     : null;

//   const coverPreview = formState.coverUrl
//     ? formState.coverUrl instanceof File
//       ? URL.createObjectURL(formState.coverUrl)
//       : `${backendUrl}/uploads/cover/${formState.coverUrl}`
//     : user.coverUrl
//     ? `${backendUrl}/uploads/cover/${user.coverUrl}`
//     : null;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormState({ ...formState, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (field: "profile" | "cover", file?: File) => {
//     setFormState({
//       ...formState,
//       [field === "profile" ? "profileUrl" : "coverUrl"]: file || undefined,
//     });
//   };

//   const clearFile = (field: "profile" | "cover", e: React.MouseEvent) => {
//     e.stopPropagation();
//     handleFileChange(field, undefined);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("firstName", formState.firstName);
//     formData.append("lastName", formState.lastName);
//     formData.append("email", formState.email);
//     formData.append("username", formState.username);
//     formData.append("role", formState.role);

//     if (formState.profileUrl instanceof File) formData.append("profileUrl", formState.profileUrl);
//     if (formState.coverUrl instanceof File) formData.append("coverUrl", formState.coverUrl);

//     startTransition(async () => {
//       const res = await handleUpdateUser(user._id, formData);
//       if (res.success) {
//         toast.success("User updated successfully!");
//         if (onSuccess) onSuccess();
//       } else {
//         toast.error(res.message);
//       }
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Cover */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Cover Image</label>
//         <div className="relative group">
//           <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 group-hover:border-blue-400 transition-all">
//             {coverPreview ? (
//               <>
//                 <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
//                 <button
//                   type="button"
//                   onClick={(e) => clearFile("cover", e)}
//                   className="absolute top-3 right-3 p-1.5 bg-gray-900 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </>
//             ) : (
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
//                 <Upload className="w-8 h-8" />
//                 <p className="text-sm mt-2">Upload cover image</p>
//               </div>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange("cover", e.target.files?.[0])}
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Profile */}
//       <div className="flex items-center gap-6">
//         <div className="relative group">
//           <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-50 overflow-hidden">
//             {profilePreview ? (
//               <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <ImageIcon className="w-8 h-8 text-gray-400" />
//               </div>
//             )}
//           </div>

//           <div className="absolute -bottom-2 -right-2 flex gap-1">
//             <label className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer">
//               <Camera className="w-4 h-4" />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleFileChange("profile", e.target.files?.[0])}
//                 className="hidden"
//               />
//             </label>
//             {profilePreview && (
//               <button
//                 type="button"
//                 onClick={(e) => clearFile("profile", e)}
//                 className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Form Inputs */}
//         <div className="flex-1 grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="firstName"
//             value={formState.firstName}
//             onChange={handleChange}
//             placeholder="First Name"
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           />
//           <input
//             type="text"
//             name="lastName"
//             value={formState.lastName}
//             onChange={handleChange}
//             placeholder="Last Name"
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           />
//           <input
//             type="text"
//             name="username"
//             value={formState.username}
//             onChange={handleChange}
//             placeholder="Username"
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             value={formState.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full px-3 py-2 border rounded-lg"
//             required
//           />
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border rounded-lg text-gray-700"
//           >
//             Cancel
//           </button>
//         )}
//         <button
//           type="submit"
//           disabled={isPending}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50"
//         >
//           {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
//           Update
//         </button>
//       </div>
//     </form>
//   );
// }
"use client";

import { useState, useTransition } from "react";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import { Camera, X, Loader2, Upload, Image as ImageIcon, Save } from "lucide-react";

interface UpdateUserFormProps {
  user: any;
//   onSuccess?: () => void;
onSuccess?: (updatedUser: any) => void;
  onCancel?: () => void;
}

export default function UpdateUserForm({ user, onSuccess, onCancel }: UpdateUserFormProps) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isPending, startTransition] = useTransition();

  const [formState, setFormState] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    username: user.username || "",
    role: user.role || "user",
    profileUrl: undefined as File | string | undefined,
    coverUrl: undefined as File | string | undefined,
  });

  const profilePreview = formState.profileUrl
    ? formState.profileUrl instanceof File
      ? URL.createObjectURL(formState.profileUrl)
      : `${backendUrl}/uploads/profile/${formState.profileUrl}`
    : user.profileUrl
    ? `${backendUrl}/uploads/profile/${user.profileUrl}`
    : null;

  const coverPreview = formState.coverUrl
    ? formState.coverUrl instanceof File
      ? URL.createObjectURL(formState.coverUrl)
      : `${backendUrl}/uploads/cover/${formState.coverUrl}`
    : user.coverUrl
    ? `${backendUrl}/uploads/cover/${user.coverUrl}`
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (field: "profile" | "cover", file?: File) => {
    setFormState({
      ...formState,
      [field === "profile" ? "profileUrl" : "coverUrl"]: file || undefined,
    });
  };

  const clearFile = (field: "profile" | "cover", e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(field, undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", formState.firstName);
    formData.append("lastName", formState.lastName);
    formData.append("email", formState.email);
    formData.append("username", formState.username);
    formData.append("role", formState.role);

    if (formState.profileUrl instanceof File) formData.append("profileUrl", formState.profileUrl);
    if (formState.coverUrl instanceof File) formData.append("coverUrl", formState.coverUrl);

    startTransition(async () => {
      const res = await handleUpdateUser(user._id, formData);
      if (res.success) {
        toast.success("User updated successfully!");
        if (onSuccess) onSuccess(res.data);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        <div className="relative group">
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 group-hover:border-blue-400 transition-all">
            {coverPreview ? (
              <>
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => clearFile("cover", e)}
                  className="absolute top-3 right-3 p-1.5 bg-gray-900 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Upload className="w-8 h-8" />
                <p className="text-sm mt-2">Upload cover image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange("cover", e.target.files?.[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-50 overflow-hidden">
            {profilePreview ? (
              <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="absolute -bottom-2 -right-2 flex gap-1">
            <label className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("profile", e.target.files?.[0])}
                className="hidden"
              />
            </label>
            {profilePreview && (
              <button
                type="button"
                onClick={(e) => clearFile("profile", e)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formState.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formState.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formState.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formState.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-white cursor-pointer"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Update
        </button>
      </div>
    </form>
  );
}
