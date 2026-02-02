"use client";

import NavBar from "../user/_components/navbar";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/cookie";

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

  if (!user) return null; // show loader if i want

  return (
    <section>
      <NavBar user={user} />
      {children}
    </section>
  );
}
