"use client";

import { useEffect } from "react";
import AdminSidebar from "./_components/AdminSidebar";
import AdminTopbar from "./_components/AdminTopbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : prefersDark
        ? "dark"
        : "light";

    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar />
        <main className="min-h-0 flex-1 overflow-hidden p-6">{children}</main>
      </div>
    </div>
  );
}
