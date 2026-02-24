"use client";

import { useState } from "react";
import TopNavbar from "./TopNavbar";
import SideNavbar from "./SideNavbar";
import type { UserData } from "./schema";

export default function Navbar({ user }: { user: UserData }) {
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
