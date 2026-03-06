"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export default function AdminSettingsPage() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Control your admin panel appearance.</p>
      </div>

      <section className="max-w-xl rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Theme</h2>
        <p className="mt-1 text-sm text-slate-500">Choose how the admin interface looks.</p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`rounded border px-4 py-2 text-sm font-medium ${
              theme === "light"
                ? "border-green-600 bg-green-600 text-white"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`rounded border px-4 py-2 text-sm font-medium ${
              theme === "dark"
                ? "border-green-600 bg-green-600 text-white"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Dark
          </button>
        </div>
      </section>
    </div>
  );
}
