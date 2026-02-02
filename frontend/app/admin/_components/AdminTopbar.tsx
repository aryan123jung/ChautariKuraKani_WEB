"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/cookie"; 

export default function AdminTopbar() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  const [admin, setAdmin] = useState<any | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const userData = await getUserData(); 
      setAdmin(userData);
    };
    fetchAdmin();
  }, []);

  if (!admin) return null; 

  const profileUrl = admin.profileUrl
    ? `${backendUrl}/uploads/profile/${admin.profileUrl}`
    : "/placeholder-profile.png";

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">Dashboard</h1>

      <div className="flex items-center gap-3">

        <span className="text-sm text-gray-600">
          {admin.firstName} {admin.lastName}
        </span>


        <Link href="/admin/profile">
          <img
            src={profileUrl}
            alt="Admin Profile"
            className="w-8 h-8 object-cover rounded-full border-2 border-gray-200"
          />
        </Link>
      </div>
    </header>
  );
}
