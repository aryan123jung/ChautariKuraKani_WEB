"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/cookie";
import { ChartColumn, FileText, House, Settings, UserCog, UserRound } from "lucide-react";
import { useState } from "react";
import DeleteModal from "@/app/_components/DeleteModal";

export default function AdminSidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (path: string) =>
    pathname === path
      ? "bg-green-600 text-white"
      : "text-gray-700 hover:bg-green-100";

  const handleLogout = async () => {
    await clearAuthCookies();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="p-6 font-bold text-xl text-green-600">
        Admin Panel
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <Link
          href="/admin/dashboard"
          className={`inline-flex w-full items-center gap-2 px-4 py-2 rounded ${linkClass("/admin/dashboard")}`}
        >
          <House size={16} />
          Dashboard
        </Link>

        <Link
          href="/admin/users"
          className={`inline-flex w-full items-center gap-2 px-4 py-2 rounded ${linkClass("/admin/users")}`}
        >
          <UserRound size={16} />
          Users
        </Link>

        <Link
          href="/admin/posts"
          className={`inline-flex w-full items-center gap-2 px-4 py-2 rounded ${linkClass("/admin/posts")}`}
        >
          <FileText size={16} />
          Posts
        </Link>

        <Link
          href="/admin/reports"
          className={`inline-flex w-full items-center gap-2 px-4 py-2 rounded ${linkClass("/admin/reports")}`}
        >
          <ChartColumn size={16} />
          Reports
        </Link>

        <Link
          href="/admin/settings"
          className={`inline-flex w-full items-center gap-2 px-4 py-2 rounded ${linkClass("/admin/settings")}`}
        >
          <Settings size={16} />
          Settings
        </Link>

        <Link
          href="/admin/profile"
          className={`inline-flex w-full items-center gap-2 px-4 py-2 rounded ${linkClass("/admin/profile")}`}
        >
          <UserCog size={16} />
          My Profile
        </Link>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <DeleteModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => void handleLogout()}
        title="Logout"
        description="Are you sure you want to logout?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
      />
    </aside>
  );
}
