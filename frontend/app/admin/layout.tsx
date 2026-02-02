"use client";

import AdminSidebar from "./_components/AdminSidebar";
import AdminTopbar from "./_components/AdminTopbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
