"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { handleSearchUsers } from "@/lib/actions/auth-action";

type Props = {
  onMenuClick: () => void;
};

type SearchUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

export default function TopNavbar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const linkClass = (path: string) =>
    pathname === path
      ? `font-semibold border-b-2 pb-1 ${
          theme === "dark"
            ? "text-zinc-100 border-emerald-500"
            : "text-gray-900 border-green-600"
        }`
      : `pb-1 transition-all ${
          theme === "dark"
            ? "text-zinc-300 hover:text-zinc-100 hover:border-b-2 hover:border-emerald-500"
            : "text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-green-600"
        }`;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!searchWrapperRef.current) return;
      if (!searchWrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(
    () => () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    },
    []
  );

  const triggerSearch = (value: string) => {
    const trimmed = value.trim();

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    const currentRequestId = ++requestIdRef.current;

    searchTimerRef.current = setTimeout(async () => {
      const response = await handleSearchUsers(trimmed, 1, 8);
      if (currentRequestId !== requestIdRef.current) return;

      if (response.success) {
        setResults((response.data || []) as SearchUser[]);
      } else {
        setResults([]);
      }

      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 350);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const onSelectUser = (user: SearchUser) => {
    setSearchTerm(user.username ? `@${user.username}` : `${user.firstName || ""} ${user.lastName || ""}`.trim());
    setIsDropdownOpen(false);
    router.push(`/user/friends?userId=${user._id}`);
  };

  const renderUserName = (user: SearchUser) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return fullName || user.username || "User";
  };

  const profileImageUrl = (profileUrl?: string) => {
    if (!profileUrl) return null;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
    return `${backendUrl}/uploads/profile/${profileUrl}`;
  };

  return (
    <header
      className={`sticky top-0 z-50 flex h-20 items-center justify-between px-6 py-2 shadow-md ${
        theme === "dark"
          ? "border-b border-zinc-800 bg-zinc-950"
          : "bg-[#76C05D]"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`rounded-md p-1 transition ${
            theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-100"
          }`}
        >
          <Menu size={18} className={theme === "dark" ? "text-zinc-100" : "text-black"} />
        </button>

        <Link href="/user/home" className="ml-10 flex items-center gap-2">
          <Image src="/image/white_half_logo.png" alt="Logo" width={40} height={40} />
          <span className={`text-lg font-bold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
            ChautariKuraKani
          </span>
        </Link>
      </div>

      <div className="relative flex flex-1 justify-center px-6" ref={searchWrapperRef}>
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
              theme === "dark" ? "text-zinc-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onFocus={() => {
              if (searchTerm.trim().length >= 2) setIsDropdownOpen(true);
            }}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchTerm(nextValue);
              triggerSearch(nextValue);
            }}
            className={`h-10 w-full rounded-lg border py-2 pl-9 pr-4 text-sm shadow-sm transition focus:outline-none focus:ring-1 ${
              theme === "dark"
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
                : "border-gray-300 bg-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
            }`}
          />

          {isDropdownOpen && searchTerm.trim().length >= 2 && (
            <div
              className={`absolute mt-2 max-h-80 w-full overflow-y-auto rounded-xl border shadow-lg ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-900"
                  : "border-gray-200 bg-white"
              }`}
            >
              {isSearching && (
                <div className={`px-4 py-3 text-sm ${theme === "dark" ? "text-zinc-300" : "text-gray-600"}`}>
                  Searching...
                </div>
              )}

              {!isSearching && results.length === 0 && (
                <div className={`px-4 py-3 text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                  No users found.
                </div>
              )}

              {!isSearching &&
                results.map((user) => {
                  const imageUrl = profileImageUrl(user.profileUrl);

                  return (
                    <button
                      key={user._id}
                      onClick={() => onSelectUser(user)}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left transition ${
                        theme === "dark"
                          ? "hover:bg-zinc-800"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-300 dark:bg-zinc-700">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imageUrl} alt={renderUserName(user)} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                            {renderUserName(user).slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`truncate text-sm font-semibold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                          {renderUserName(user)}
                        </p>
                        <p className={`truncate text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                          @{user.username || "unknown"}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/user/home" className={linkClass("/user/home")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/user/friends" className={linkClass("/user/friends")}>
                Friends
              </Link>
            </li>
            <li>
              <Link href="/user/chautari" className={linkClass("/user/chautari")}>
                Chautari
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={toggleTheme}
          className={`rounded-full p-2 transition ${
            theme === "dark"
              ? "bg-zinc-800 text-amber-300 hover:bg-zinc-700"
              : "bg-white/70 text-slate-800 hover:bg-white"
          }`}
          aria-label="Toggle light and dark mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className={`relative rounded-full p-1 transition ${
            theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-100"
          }`}
        >
          <Image src="/image/notification.ico" alt="Notification" width={24} height={24} />
        </button>
      </div>
    </header>
  );
}
