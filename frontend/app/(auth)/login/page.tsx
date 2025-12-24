"use client";

import LoginForm from "../_components/LoginForm";

export default function Page() {
    return (
        <div className="space-y-6 w-full">
            <div className="text-center">
                <h1 className="text-2xl font-semibold pt-3">Welcome back</h1>
                <p className="mt-1 text-sm text-foreground/70 pt-2 ">Log in to your account</p>
            </div>
            <LoginForm />
        </div>
    );
}