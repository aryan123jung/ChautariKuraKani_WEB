"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/cookie";

export default function AdminSidebar() {
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
        <Link href="/admin" className={`block px-4 py-2 rounded ${linkClass("/admin")}`}>
          Dashboard
        </Link>

        <Link href="/admin/users" className={`block px-4 py-2 rounded ${linkClass("/admin/users")}`}>
          Users
        </Link>

        <Link href="/admin/posts" className={`block px-4 py-2 rounded ${linkClass("/admin/posts")}`}>
          Posts
        </Link>

        <Link href="/admin/reports" className={`block px-4 py-2 rounded ${linkClass("/admin/reports")}`}>
          Reports
        </Link>

        <Link href="/admin/settings" className={`block px-4 py-2 rounded ${linkClass("/admin/settings")}`}>
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
