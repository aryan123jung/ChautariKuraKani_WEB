"use client";

import { useEffect, useState } from "react";
import { getUserData } from "@/lib/cookie";
import Navbar from "./_components/navbar";

type UserData = {
  firstName: string;
  lastName: string;
  profileUrl?: string;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData();
      if (data) setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) return null; // or loader

  return (
    <section>
      <Navbar user={user} />
      {children}
    </section>
  );
}
