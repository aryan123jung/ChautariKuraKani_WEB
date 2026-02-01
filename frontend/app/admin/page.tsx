"use client";

import { clearAuthCookies } from "@/lib/cookie";
import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

      const handleLogout = async () => {
        await clearAuthCookies();
        router.push("/login");
        router.refresh();
      };
      
    return (
        <div>
            Admin Dashboard

            <div>
                <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Logout
          </button>
            </div>
        </div>
        
    );
}