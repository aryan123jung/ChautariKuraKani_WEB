// import Image from "next/image";

// export default function ProfilePage() {
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        
//         {/* Header */}
//         <div className="flex items-center gap-4 p-6 border-b">
//           <div className="w-20 h-20 rounded-full overflow-hidden border">
//             <Image
//               src="/image/person.jpg"
//               alt="Aryan Jung Chhetri"
//               width={80}
//               height={80}
//               className="object-cover"
//             />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold">Aryan Jung Chhetri</h1>
//             <p className="text-gray-500">@aryanjungchhetri</p>
//           </div>
//         </div>

//         {/* Info Section */}
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h2 className="font-semibold text-gray-700 mb-2">
//               Personal Info
//             </h2>
//             <p><span className="font-medium">Email:</span> aryan@gmail.com</p>
//             <p><span className="font-medium">Location:</span> Nepal 🇳🇵</p>
//           </div>

//           <div>
//             <h2 className="font-semibold text-gray-700 mb-2">
//               Stats
//             </h2>
//             <p>Posts: 12</p>
//             <p>Friends: 48</p>
//             <p>Communities: 6</p>
//           </div>
//         </div>

//         {/* Bio */}
//         <div className="p-6 border-t">
//           <h2 className="font-semibold text-gray-700 mb-2">Bio</h2>
//           <p className="text-gray-600">
//             Building ChautariKuraKani 🚀  
//             Love tech, design & meaningful conversations.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { updateUserSchema, UpdateUserData } from "@/lib/validations/user";
// import { handleUpdateProfile } from "@/lib/actions/auth-action";
// import { toast } from "react-toastify";

// export default function ProfilePage() {
//   const [user, setUser] = useState<any>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting },
//   } = useForm<UpdateUserData>({
//     resolver: zodResolver(updateUserSchema),
//   });

//   /* 🔹 Fetch logged in user */
//   useEffect(() => {
//     const fetchUser = async () => {
//       const res = await fetch("/api/auth/me");
//       const data = await res.json();
//       setUser(data.user);

//       reset({
//         firstName: data.user.firstName,
//         lastName: data.user.lastName,
//         email: data.user.email,
//         username: data.user.username,
//       });
//     };

//     fetchUser();
//   }, [reset]);

//   /* 🔹 Image preview */
//   const handleImage = (file: File | undefined, onChange: any) => {
//     if (!file) return;
//     setPreview(URL.createObjectURL(file));
//     onChange(file);
//   };

//   /* 🔹 Submit */
//   const onSubmit = async (data: UpdateUserData) => {
//     const formData = new FormData();

//     Object.entries(data).forEach(([key, value]) => {
//       if (value) formData.append(key, value as any);
//     });

//     const res = await handleUpdateProfile(formData);

//     if (!res.success) {
//       toast.error(res.message);
//       return;
//     }

//     toast.success("Profile updated");
//     setPreview(null);
//     setUser(res.user);
//   };

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">

//         {/* HEADER */}
//         <div className="flex items-center gap-5 p-6 border-b">
//           <div className="relative w-20 h-20 rounded-full overflow-hidden border">
//             <Image
//               src={
//                 preview
//                   ? preview
//                   : user.imageUrl
//                   ? process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl
//                   : "/image/person.jpg"
//               }
//               alt="Profile"
//               fill
//               className="object-cover"
//             />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold">
//               {user.firstName} {user.lastName}
//             </h1>
//             <p className="text-gray-500">@{user.username}</p>
//           </div>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid gap-6">

//           {/* Image Upload */}
//           <Controller
//             name="image"
//             control={control}
//             render={({ field: { onChange } }) => (
//               <input
//                 ref={fileRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   handleImage(e.target.files?.[0], onChange)
//                 }
//               />
//             )}
//           />

//           {/* Inputs */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <input {...register("firstName")} placeholder="First Name" className="input" />
//             <input {...register("lastName")} placeholder="Last Name" className="input" />
//             <input {...register("username")} placeholder="Username" className="input" />
//             <input {...register("email")} placeholder="Email" className="input" />
//           </div>

//           {/* Submit */}
//           <button
//             disabled={isSubmitting}
//             className="self-start px-5 py-2 bg-black text-white rounded"
//           >
//             {isSubmitting ? "Updating..." : "Update Profile"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



import { getUserData } from "@/lib/cookie";
import ProfileCover from "./_components/ProfileCover";
import ProfileAvatar from "./_components/ProfileAvatar";
import ProfileDetails from "./_components/ProfileDetails";
import ProfileStats from "./_components/ProfileStats";

const DEFAULT_COVER = "/images/default-cover.jpg";
const DEFAULT_AVATAR = "/images/default-avatar.png";

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cover */}
      <ProfileCover coverUrl={user.coverUrl ?? DEFAULT_COVER} />

      <div className="relative px-6">
        {/* Avatar */}
        <ProfileAvatar profileUrl={user.profileUrl ?? DEFAULT_AVATAR} />

        {/* Details */}
        <ProfileDetails user={user} />

        {/* Stats */}
        <ProfileStats user={user} />
      </div>
    </div>
  );
}
