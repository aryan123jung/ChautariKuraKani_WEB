"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/cookie";

type UserData = {
  firstName: string;
  lastName: string;
  profileUrl?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: UserData;
};

export default function SideNavbar({ open, onClose, user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const isProfileActive = pathname === "/user/profile" || pathname.startsWith("/user/profile/");

  const sidebarLinkClass = (path: string) =>
    pathname === path
      ? "bg-[#76C05D] text-white font-semibold px-3 py-2 rounded-md block"
      : "text-black dark:text-zinc-200 hover:text-green-600 hover:underline transition-colors block px-3 py-2 rounded-md";

  const handleLogout = async () => {
    await clearAuthCookies();
    router.push("/login");
    router.refresh();
  };

  const profileImage = user.profileUrl
    ? `${backendUrl}/uploads/profile/${user.profileUrl}`
    : "/image/profile_icon_214017.ico";

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
            bg-white dark:bg-zinc-950 dark:border-r dark:border-zinc-800`}
        >
        <div>
          <div className="p-6 border-b border-green-700 dark:border-zinc-800 flex justify-between items-center">
            <span className="font-semibold text-lg">Menu</span>
            <button onClick={onClose} className="text-xl">✕</button>
          </div>

          <ul className="p-4 space-y-2">
            <li><Link href="/user/home" className={sidebarLinkClass("/user/home")}>Home</Link></li>
            <li><Link href="/user/settings" className={sidebarLinkClass("/user/settings")}>Settings</Link></li>
            <li><Link href="/user/friends" className={sidebarLinkClass("/user/friends")}>Friends</Link></li>
            <li><Link href="/user/chautari" className={sidebarLinkClass("/user/chautari")}>Chautari</Link></li>
            <li><Link href="/user/notification" className={sidebarLinkClass("/user/notification")}>Notification</Link></li>
            <li><Link href="/user/message" className={sidebarLinkClass("/user/message")}>Messages</Link></li>
            <li><Link href="/user/help" className={sidebarLinkClass("/user/help")}>Help</Link></li>
          </ul>
        </div>

        <div className="mt-auto p-4">
          <Link
            href="/user/profile"
            className={`flex items-center gap-2
                ${isProfileActive
                ? "bg-green-50 border-green-500 dark:bg-zinc-800 dark:border-green-500"
                : "bg-gray-100 dark:bg-zinc-900 border-gray-300 dark:border-zinc-700"}
                rounded-md
                p-2
                border
                hover:border-green-500
                hover:bg-green-50
                dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800
                hover:shadow-md
                transition-all duration-200`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-semibold">
              {user.firstName} {user.lastName}
            </p>
          </Link>

          <div className="border-t border-green-700 dark:border-zinc-800 my-3" />

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
