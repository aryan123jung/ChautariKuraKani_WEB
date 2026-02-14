// import Image from "next/image";

// export default function ProfileAvatar({
//   profileUrl,
// }: {
//   profileUrl?: string;
// }) {
//   return (
//     <div className="relative w-32 h-32 -mt-16 rounded-full overflow-hidden border-4 border-white bg-gray-300">
//       {profileUrl && (
//         <Image
//           src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${profileUrl}`}
//           alt="Profile"
//           fill
//           className="object-cover"
//         />
//       )}
//     </div>
//   );
// }

// import Image from "next/image";

// export default function ProfileAvatar({
//   profileUrl,
// }: {
//   profileUrl?: string | null;
// }) {
//   const src = profileUrl
//     ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${profileUrl}?t=${Date.now()}`
//     : undefined;

//   return (
//     <div className="relative w-32 h-32 -mt-16 rounded-full overflow-hidden border-4 border-white bg-gray-300">
//       {src ? (
//         <Image
//           src={src}
//           alt="Profile"
//           fill
//           className="object-cover"
//           priority
//         />
//       ) : (
//         <div className="w-full h-full flex items-center justify-center text-gray-400">
//           <span>No Image</span>
//         </div>
//       )}
//     </div>
//   );
// }


import Image from "next/image";

export default function ProfileAvatar({ profileUrl }: { profileUrl?: string | null }) {
  if (!profileUrl) {
    return (
      <div className="relative w-32 h-32 -mt-16 rounded-full overflow-hidden border-4 border-white bg-gray-300 flex items-center justify-center text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div className="relative w-32 h-32 -mt-16 rounded-full overflow-hidden border-4 border-white bg-gray-300">
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${profileUrl}`}
        alt="Profile"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
