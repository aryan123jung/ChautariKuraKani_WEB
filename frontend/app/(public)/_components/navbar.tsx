"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthCookies } from "@/lib/cookie";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

   const linkClass = (path: string) =>
     pathname === path
       ? "text-black underline decoration-black"
       : "text-white hover:text-black hover:underline hover:decoration-black transition-colors";


  const sidebarLinkClass = (path: string) =>
    pathname === path
      ? "bg-[#76C05D] text-white underline font-semibold px-3 py-2 rounded-md block"
      : "text-black hover:text-green-600 hover:underline hover:decoration-black transition-colors block px-3 py-2 rounded-md";


  const router = useRouter();

const handleLogout = async () => {
  await clearAuthCookies();   // server action
  router.push("/login");      // or "/"
  router.refresh();           // re-render server components
};


  return (
    <header className="flex items-center justify-between bg-[#76C05D] p-3">
      <div className="flex items-center gap-3 ml-3">
        <Image
          onClick={() => setOpen(true)}
          className="text-2xl mr-10"
          src="/image/menu-button_icon-icons.com_72989.ico"
          alt="Logo"
          width={13}
          height={13}
        />
        <Image
          src="/image/white_half_logo.png"
          alt="Logo"
          width={60}
          height={60}
        />
        <span className="font-semibold text-lg text-black">ChautariKuraKani</span>
      </div>
      <div className="flex-1 flex justify-center px-5">
        <input
          type="text"
          placeholder="Search ...."
          className="h-10 w-1/2 bg-white rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
      </div>
      <nav>
        <ul className="flex gap-20 text-white mr-30">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/friends" className="text-white hover:text-black hover:underline hover:decoration-black transition-colors">Friends</Link>
          <Link href="/chautari" className="text-white hover:text-black hover:underline hover:decoration-black transition-colors">Chautari</Link>
        </ul>
      </nav>

      <div className="mr-5">
        <Image
          src="/image/notification.ico"
          alt="notification"
          width={30}
          height={30}
        />
     </div>




      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col justify-between transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-white text-black`}
      >
      {/* <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col justify-between transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-[#76C05D] text-white`}
      > */}
        <div>
          <div className="p-6.5 border-b border-green-700 flex justify-between items-center">
            <span className="font-semibold text-lg text-black">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="text-black text-xl hover:text-black transition-colors"
            >
              ✕
            </button>
          </div>
          <ul className="p-4 space-y-2">
            <li>
              <Link href="/" className={sidebarLinkClass("/")}>Home</Link>
            </li>
            <li>
              <Link href="/settings" className={sidebarLinkClass("/settings")}>Settings</Link>
            </li>
            <li>
              <Link href="/friends" className={sidebarLinkClass("/friends")}>Friends</Link>
            </li>
            <li>
              <Link href="/chautari" className={sidebarLinkClass("/chautari")}>Chautari</Link>
            </li>
            <li>
              <Link href="/notification" className={sidebarLinkClass("/notification")}>Notification</Link>
            </li>
            <li>
              <Link href="/message" className={sidebarLinkClass("/message")}>Messages</Link>
            </li>
            <li>
              <Link href="/help" className={sidebarLinkClass("/help")}>Help</Link>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-green-700">
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-colors">
            Logout
          </button>
        </div>
      </aside>
    </header>
  );
}
