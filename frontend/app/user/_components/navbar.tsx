"use client";

import { useState } from "react";
import TopNavbar from "./TopNavbar";
import SideNavbar from "./SideNavbar";

type UserData = {
  firstName: string;
  lastName: string;
  profileUrl?: string;
};

export default function NavBar({ user }: { user: UserData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TopNavbar onMenuClick={() => setOpen(true)} />
      <SideNavbar
        open={open}
        onClose={() => setOpen(false)}
        user={user}
      />
    </>
  );
}
