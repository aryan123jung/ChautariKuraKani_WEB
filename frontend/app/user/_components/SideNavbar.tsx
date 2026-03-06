"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/cookie";
import type { SideNavbarProps } from "./schema";
import { useState } from "react";
import {
  Bell,
  CircleHelp,
  House,
  MessageCircle,
  Settings,
  Users,
  Trees,
} from "lucide-react";
import DeleteModal from "@/app/_components/DeleteModal";

export default function SideNavbar({ open, onClose, user }: SideNavbarProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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
    onClose();
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
            <li>
              <Link href="/user/home" className={`${sidebarLinkClass("/user/home")} inline-flex items-center gap-2`}>
                <House size={16} />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/user/settings"
                className={`${sidebarLinkClass("/user/settings")} inline-flex items-center gap-2`}
              >
                <Settings size={16} />
                Settings
              </Link>
            </li>
            <li>
              <Link
                href="/user/friends"
                className={`${sidebarLinkClass("/user/friends")} inline-flex items-center gap-2`}
              >
                <Users size={16} />
                Friends
              </Link>
            </li>
            <li>
              <Link
                href="/user/chautari"
                className={`${sidebarLinkClass("/user/chautari")} inline-flex items-center gap-2`}
              >
                <Trees size={16} />
                Chautari
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  window.dispatchEvent(new Event("open-notifications-modal"));
                  onClose();
                }}
                className="text-black dark:text-zinc-200 hover:text-green-600 hover:underline transition-colors block px-3 py-2 rounded-md w-full text-left inline-flex items-center gap-2"
              >
                <Bell size={16} />
                Notification
              </button>
            </li>
            <li>
              <Link
                href="/user/message"
                className={`${sidebarLinkClass("/user/message")} inline-flex items-center gap-2`}
              >
                <MessageCircle size={16} />
                Messages
              </Link>
            </li>
            <li>
              <Link href="/user/help" className={`${sidebarLinkClass("/user/help")} inline-flex items-center gap-2`}>
                <CircleHelp size={16} />
                Help & Privacy Policy
              </Link>
            </li>
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
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <DeleteModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => void handleLogout()}
        title="Logout"
        description="Are you sure you want to logout?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
      />
    </>
  );
}
