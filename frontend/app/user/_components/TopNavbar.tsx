// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { clearAuthCookies } from "@/lib/cookie";

// type UserData = {
//   firstName: string;
//   lastName: string;
//   profileUrl?: string;
// };

// export default function NavBar({ user }: { user: UserData }) {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   const linkClass = (path: string) =>
//     pathname === path
//       ? "text-black underline decoration-black"
//       : "text-white hover:text-black hover:underline hover:decoration-black transition-colors";

//   const sidebarLinkClass = (path: string) =>
//     pathname === path
//       ? "bg-[#76C05D] text-white underline font-semibold px-3 py-2 rounded-md block"
//       : "text-black hover:text-green-600 hover:underline hover:decoration-black transition-colors block px-3 py-2 rounded-md ";

//   const handleLogout = async () => {
//     await clearAuthCookies();
//     router.push("/login");
//     router.refresh();
//   };

//   const backendUrl = process.env.NEXT_PUBLIC_API_URL;

//   const profileImage = user.profileUrl
//     ? `${backendUrl}/uploads/profile/${user.profileUrl}`
//     : "/image/profile_icon_214017.ico";

//   return (
//     <header className="flex items-center justify-between bg-[#76C05D] p-3">
//       {/* Left */}
//       <div className="flex items-center gap-3 ml-3">
//         <Image
//           onClick={() => setOpen(true)}
//           src="/image/menu-button_icon-icons.com_72989.ico"
//           alt="Menu"
//           width={20}
//           height={20}
//           className="cursor-pointer"
//         />
//         <Image
//           src="/image/white_half_logo.png"
//           alt="Logo"
//           width={60}
//           height={60}
//         />
//         <span className="font-semibold text-lg text-black">ChautariKuraKani</span>
//       </div>

//       {/* Search */}
//       <div className="flex-1 flex justify-center px-5">
//         <input
//           type="text"
//           placeholder="Search ...."
//           className="h-10 w-1/2 bg-white rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
//         />
//       </div>

//       {/* Top Nav */}
//       <nav>
//         <ul className="flex gap-10 text-white mr-10">
//           <Link href="/user/home" className={linkClass("/home")}>Home</Link>
//           <Link href="/user/friends" className={linkClass("/friends")}>Friends</Link>
//           <Link href="/user/chautari" className={linkClass("/chautari")}>Chautari</Link>
//         </ul>
//       </nav>

//       {/* Notification */}
//       <div className="mr-5">
//         <Image src="/image/notification.ico" alt="notification" width={30} height={30} />
//       </div>

//       {/* Overlay */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/40 z-40"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform ${
//           open ? "translate-x-0" : "-translate-x-full"
//         } bg-white text-black`}
//       >
//         <div>
//           <div className="p-6 border-b border-green-700 flex justify-between items-center">
//             <span className="font-semibold text-lg">Menu</span>
//             <button onClick={() => setOpen(false)} className="text-xl">✕</button>
//           </div>

//           <ul className="p-4 space-y-2">
//             <li><Link href="/user/home" className={sidebarLinkClass("/home")}>Home</Link></li>
//             <li><Link href="/user/settings" className={sidebarLinkClass("/settings")}>Settings</Link></li>
//             <li><Link href="/user/friends" className={sidebarLinkClass("/friends")}>Friends</Link></li>
//             <li><Link href="/user/chautari" className={sidebarLinkClass("/chautari")}>Chautari</Link></li>
//             <li><Link href="/user/notification" className={sidebarLinkClass("/notification")}>Notification</Link></li>
//             <li><Link href="/user/message" className={sidebarLinkClass("/message")}>Messages</Link></li>
//             <li><Link href="/user/help" className={sidebarLinkClass("/help")}>Help</Link></li>
//           </ul>
//         </div>

//         <div className="mt-auto p-4">
//           {/* <Link href={"/user/profile"} className="flex items-center gap-2 bg-gray-300 rounded-md p-2"> */}
//           {/* <Link href={"/user/profile"} className="flex items-center gap-2 bg-gray-300 rounded-md p-2"> */}
//           <Link
//             href="/user/profile"
//             className="
//               flex items-center gap-2
//               bg-gray-100
//               rounded-md
//               p-2
//               border border-gray-300
//               hover:border-green-500
//               transition-colors duration-200
//             "
//           >
//             <div className="w-10 h-10 rounded-full overflow-hidden">
//               <img
//                 src={profileImage}
//                 alt={`${user.firstName} ${user.lastName}`}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <p className="font-semibold">{user.firstName} {user.lastName}</p>
//           </Link>

//           <div className="border-t border-green-700 my-3" />

//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>
//     </header>
//   );
// }


// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// type Props = {
//   onMenuClick: () => void;
// };

// export default function TopNavbar({ onMenuClick }: Props) {
//   const pathname = usePathname();

//   const linkClass = (path: string) =>
//     pathname === path
//       ? "text-black underline decoration-black"
//       : "text-white hover:text-black hover:underline hover:decoration-black transition-colors";

//   return (
//     <header className="flex items-center justify-between bg-[#76C05D] p-3">
//       {/* Left */}
//       <div className="flex items-center gap-3 ml-3">
//         <Image
//           onClick={onMenuClick}
//           src="/image/menu-button_icon-icons.com_72989.ico"
//           alt="Menu"
//           width={16}
//           height={16}
//           className="cursor-pointer"
//         />

//         <Image
//           src="/image/white_half_logo.png"
//           alt="Logo"
//           width={60}
//           height={60}
//         />

//         <span className="font-semibold text-lg text-black">
//           ChautariKuraKani
//         </span>
//       </div>

//       {/* Search */}
//       <div className="flex-1 flex justify-center px-5">
//         <input
//           type="text"
//           placeholder="Search ...."
//           className="h-10 w-1/2 bg-white rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
//         />
//       </div>

//       {/* Nav links */}
//       <nav>
//         <ul className="flex gap-10 text-white mr-10">
//           <Link href="/user/home" className={linkClass("/user/home")}>Home</Link>
//           <Link href="/user/friends" className={linkClass("/user/friends")}>Friends</Link>
//           <Link href="/user/chautari" className={linkClass("/user/chautari")}>Chautari</Link>
//         </ul>
//       </nav>

//       {/* Notification */}
//       <div className="mr-5">
//         <Image
//           src="/image/notification.ico"
//           alt="notification"
//           width={30}
//           height={30}
//         />
//       </div>
//     </header>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  onMenuClick: () => void;
};

export default function TopNavbar({ onMenuClick }: Props) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-gray-900 font-semibold border-b-2 border-green-600 pb-1"
      : "text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-green-600 pb-1 transition-all";

  return (
    <header className="flex items-center justify-between bg-[#76C05D] shadow-md px-6 py-2 sticky top-0 z-50 h-20">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-1 hover:bg-gray-100 rounded-md transition">
          <Image
            src="/image/menu-button_icon-icons.com_72989.ico"
            alt="Menu"
            width={16}
            height={16}
          />
        </button>

        <Link href="/user/home" className="flex items-center gap-2 ml-10">
          <Image
            src="/image/white_half_logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <span className="font-bold text-lg text-gray-900">ChautariKuraKani</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md h-10 bg-gray-100 rounded-lg border border-gray-300 px-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 shadow-sm transition"
        />
      </div>

      {/* Right: Links + Notification */}
      <div className="flex items-center gap-6">
        <nav>
          <ul className="flex gap-6">
            <li><Link href="/user/home" className={linkClass("/user/home")}>Home</Link></li>
            <li><Link href="/user/friends" className={linkClass("/user/friends")}>Friends</Link></li>
            <li><Link href="/user/chautari" className={linkClass("/user/chautari")}>Chautari</Link></li>
          </ul>
        </nav>

        <button className="relative p-1 hover:bg-gray-100 rounded-full transition">
          <Image src="/image/notification.ico" alt="Notification" width={24} height={24} />
          {/* Optional: notification badge */}
          {/* <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" /> */}
        </button>
      </div>
    </header>
  );
}
