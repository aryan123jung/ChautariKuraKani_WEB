"use client";

import NavBar from "../user/_components/navbar";

export default function Layout({children}: {children: React.ReactNode}) {
    


    return (
        <section>
        <NavBar/>   
            {children}
        </section>
    );
}