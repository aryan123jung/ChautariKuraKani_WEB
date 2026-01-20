"use client";

import { usePathname } from "next/navigation";
import NavBar from "./_components/navbar";

export default function Layout({children}: {children: React.ReactNode}) {
    
    const pathname = usePathname();

    const hideNavBar = pathname === "/";

    return (
        <section>
            {!hideNavBar && <NavBar/>}
            {children}
        </section>
    );
}