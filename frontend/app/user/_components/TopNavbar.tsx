"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { handleSearchUsers } from "@/lib/actions/auth-action";
import {
  handleAcceptFriendRequest,
  handleGetIncomingFriendRequests,
  handleRejectFriendRequest,
} from "@/lib/actions/friend-action";
import {
  handleGetNotifications,
  handleMarkAllNotificationsRead,
  handleMarkNotificationRead,
} from "@/lib/actions/notification-action";
import { toast } from "react-toastify";

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

type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
  profileImage?: string;
};

type IncomingFriendRequest = {
  _id: string;
  fromUserId: string | FriendUser;
  toUserId: string | FriendUser;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt?: string;
};

type NotificationItem = {
  _id: string;
  actorUserId?: string | FriendUser;
  type:
    | "FRIEND_REQUEST_SENT"
    | "FRIEND_REQUEST_ACCEPTED"
    | "POST_LIKED"
    | "POST_COMMENTED";
  entityType?: string;
  entityId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
};

type MessageEvent = {
  _id: string;
  text?: string;
  senderId?: string | FriendUser;
  conversationId?: string;
  createdAt?: string;
};

type MessageAlertItem = {
  id: string;
  senderName: string;
  senderAvatar?: string | null;
  text: string;
  conversationId?: string;
  isRead: boolean;
  createdAt?: string;
};

const getAuthTokenFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const getCurrentUserIdFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )user_data=([^;]+)/);
  if (!match) return null;

  try {
    const user = JSON.parse(decodeURIComponent(match[1]));
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
};

export default function TopNavbar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const notificationWrapperRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<Socket | null>(null);

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

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<IncomingFriendRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [messageAlerts, setMessageAlerts] = useState<MessageAlertItem[]>([]);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [activeNotificationRequestId, setActiveNotificationRequestId] = useState<string | null>(null);
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);
  const [isMarkAllBusy, setIsMarkAllBusy] = useState(false);

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

  const profileImageUrl = (profileUrl?: string | null) => {
    if (!profileUrl) return null;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
    return `${backendUrl}/uploads/profile/${profileUrl}`;
  };

  const fetchNotificationCenter = async () => {
    setIsNotificationLoading(true);
    try {
      const [incomingResponse, notificationsResponse] = await Promise.all([
        handleGetIncomingFriendRequests(1, 20),
        handleGetNotifications(1, 25),
      ]);

      setIncomingRequests(
        incomingResponse.success
          ? ((incomingResponse.data || []) as IncomingFriendRequest[])
          : []
      );

      setNotifications(
        notificationsResponse.success
          ? ((notificationsResponse.data || []) as NotificationItem[])
          : []
      );
    } finally {
      setIsNotificationLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }

      if (
        notificationWrapperRef.current &&
        !notificationWrapperRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
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

  useEffect(() => {
    void fetchNotificationCenter();
    const interval = setInterval(() => {
      void fetchNotificationCenter();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const openNotifications = () => {
      setIsNotificationOpen(true);
      void fetchNotificationCenter();
    };

    window.addEventListener("open-notifications-modal", openNotifications);
    return () => {
      window.removeEventListener("open-notifications-modal", openNotifications);
    };
  }, []);

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

      setResults(response.success ? ((response.data || []) as SearchUser[]) : []);
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 350);
  };

  const onSelectUser = (user: SearchUser) => {
    setSearchTerm(
      user.username
        ? `@${user.username}`
        : `${user.firstName || ""} ${user.lastName || ""}`.trim()
    );
    setIsDropdownOpen(false);
    router.push(`/user/profile/${user._id}`);
  };

  const renderUserName = (user: SearchUser) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return fullName || user.username || "User";
  };

  const getRequestSender = (request: IncomingFriendRequest) => {
    if (!request.fromUserId || typeof request.fromUserId === "string") return null;
    return request.fromUserId;
  };

  const getNotificationActor = (notification: NotificationItem) => {
    if (!notification.actorUserId || typeof notification.actorUserId === "string") {
      return null;
    }
    return notification.actorUserId;
  };

  const onAcceptRequest = async (requestId: string) => {
    if (activeNotificationRequestId) return;

    setActiveNotificationRequestId(requestId);
    try {
      const response = await handleAcceptFriendRequest(requestId);
      if (!response.success) {
        throw new Error(response.message || "Failed to accept request");
      }

      setIncomingRequests((prev) => prev.filter((item) => item._id !== requestId));
      await fetchNotificationCenter();
      toast.success(response.message || "Friend request accepted");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to accept request");
    } finally {
      setActiveNotificationRequestId(null);
    }
  };

  const onRejectRequest = async (requestId: string) => {
    if (activeNotificationRequestId) return;

    setActiveNotificationRequestId(requestId);
    try {
      const response = await handleRejectFriendRequest(requestId);
      if (!response.success) {
        throw new Error(response.message || "Failed to reject request");
      }

      setIncomingRequests((prev) => prev.filter((item) => item._id !== requestId));
      await fetchNotificationCenter();
      toast.success(response.message || "Friend request rejected");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to reject request");
    } finally {
      setActiveNotificationRequestId(null);
    }
  };

  const onMarkRead = async (notificationId: string) => {
    if (activeNotificationId) return;

    setActiveNotificationId(notificationId);
    try {
      const response = await handleMarkNotificationRead(notificationId);
      if (!response.success) {
        throw new Error(response.message || "Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item
        )
      );
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to mark as read");
    } finally {
      setActiveNotificationId(null);
    }
  };

  const onMarkAllRead = async () => {
    if (isMarkAllBusy) return;

    setIsMarkAllBusy(true);
    try {
      const response = await handleMarkAllNotificationsRead();
      if (!response.success) {
        throw new Error(response.message || "Failed to mark all as read");
      }

      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setMessageAlerts((prev) => prev.map((item) => ({ ...item, isRead: true })));
      toast.success(response.message || "All notifications marked as read");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to mark all as read");
    } finally {
      setIsMarkAllBusy(false);
    }
  };

  const onOpenMessageAlert = (alertId: string, conversationId?: string) => {
    setMessageAlerts((prev) =>
      prev.map((item) => (item.id === alertId ? { ...item, isRead: true } : item))
    );

    if (conversationId) {
      router.push(`/user/message?conversationId=${conversationId}`);
      return;
    }

    router.push("/user/message");
  };

  const unreadCount =
    notifications.filter((notification) => !notification.isRead).length +
    messageAlerts.filter((item) => !item.isRead).length;

  useEffect(() => {
    const token = getAuthTokenFromCookie();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";

    if (!token) return;
    if (socketRef.current) return;

    const socket = io(backendUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("notification:new", (notification: NotificationItem) => {
      setNotifications((prev) => {
        if (prev.some((item) => item._id === notification._id)) return prev;
        return [notification, ...prev];
      });

      toast.info(notification.message || notification.title || "New notification");

      if (notification.type === "FRIEND_REQUEST_SENT") {
        void fetchNotificationCenter();
      }
    });

    socket.on("message:new", (message: MessageEvent) => {
      const currentUserId = getCurrentUserIdFromCookie();
      const senderId =
        message.senderId && typeof message.senderId !== "string"
          ? message.senderId._id
          : message.senderId;

      if (pathname.startsWith("/user/message")) return;
      if (currentUserId && senderId && currentUserId === senderId) return;

      const sender =
        message.senderId && typeof message.senderId !== "string"
          ? message.senderId
          : null;
      const senderName =
        `${sender?.firstName || ""} ${sender?.lastName || ""}`.trim() ||
        sender?.username ||
        "Someone";

      setMessageAlerts((prev) => {
        const nextItem: MessageAlertItem = {
          id: `message-${message._id}`,
          senderName,
          senderAvatar: sender?.profileUrl || sender?.profileImage || null,
          text: message.text || "sent a message",
          conversationId: message.conversationId,
          isRead: false,
          createdAt: message.createdAt,
        };

        const deduped = prev.filter((item) => item.id !== nextItem.id);
        return [nextItem, ...deduped].slice(0, 25);
      });

      toast.info(`${senderName}: ${message.text || "sent a message"}`);
    });

    socketRef.current = socket;

    return () => {
      socket.off("notification:new");
      socket.off("message:new");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [pathname]);

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
            <li>
              <Link href="/user/message" className={linkClass("/user/message")}>
                Messages
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          className={`rounded-full p-2 transition ${
            theme === "dark"
              ? "bg-zinc-800 text-amber-300 hover:bg-zinc-700"
              : "bg-white/70 text-slate-800 hover:bg-white"
          }`}
          aria-label="Toggle light and dark mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={notificationWrapperRef}>
          <button
            onClick={() => {
              const next = !isNotificationOpen;
              setIsNotificationOpen(next);
              if (next) void fetchNotificationCenter();
            }}
            className={`relative rounded-full p-1 transition ${
              theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-100"
            }`}
          >
            <Image src="/image/notification.ico" alt="Notification" width={24} height={24} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div
              className={`absolute right-0 mt-2 w-[26rem] overflow-hidden rounded-xl border shadow-xl ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-900"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className={`flex items-center justify-between border-b px-4 py-3 ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
                <h3 className={`text-sm font-semibold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                  Notifications
                </h3>
                <button
                  onClick={() => void onMarkAllRead()}
                  disabled={isMarkAllBusy || unreadCount === 0}
                  className={`text-xs font-semibold ${
                    unreadCount === 0
                      ? "text-gray-400"
                      : theme === "dark"
                        ? "text-emerald-300"
                        : "text-green-700"
                  }`}
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isNotificationLoading && (
                  <p className={`px-4 py-4 text-sm ${theme === "dark" ? "text-zinc-300" : "text-gray-600"}`}>
                    Loading...
                  </p>
                )}

                {!isNotificationLoading && messageAlerts.length > 0 && (
                  <div className={`border-b px-4 py-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-100"}`}>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                      New Messages
                    </p>
                    <div className="space-y-2">
                      {messageAlerts.map((alert) => {
                        const avatar = profileImageUrl(alert.senderAvatar || null);
                        return (
                          <button
                            key={alert.id}
                            onClick={() => onOpenMessageAlert(alert.id, alert.conversationId)}
                            className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                              alert.isRead
                                ? theme === "dark"
                                  ? "border-zinc-800 bg-zinc-900"
                                  : "border-gray-200 bg-white"
                                : theme === "dark"
                                  ? "border-emerald-700/40 bg-zinc-800"
                                  : "border-green-200 bg-green-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-300 dark:bg-zinc-700">
                                {avatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={avatar} alt={alert.senderName} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                    {alert.senderName.slice(0, 1).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-sm font-semibold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                                  {alert.senderName}
                                </p>
                                <p className={`line-clamp-2 text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                                  {alert.text}
                                </p>
                              </div>
                              {!alert.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-green-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isNotificationLoading && incomingRequests.length > 0 && (
                  <div className={`border-b px-4 py-3 ${theme === "dark" ? "border-zinc-800" : "border-gray-100"}`}>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                      Pending Requests
                    </p>
                    <div className="space-y-3">
                      {incomingRequests.map((request) => {
                        const sender = getRequestSender(request);
                        const senderName = `${sender?.firstName || ""} ${sender?.lastName || ""}`.trim() || sender?.username || "User";
                        const senderImage = profileImageUrl(sender?.profileUrl || sender?.profileImage);

                        return (
                          <div key={request._id} className="flex items-start gap-3">
                            <button
                              onClick={() => sender?._id && router.push(`/user/profile/${sender._id}`)}
                              className="h-9 w-9 overflow-hidden rounded-full bg-gray-300 dark:bg-zinc-700"
                            >
                              {senderImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={senderImage} alt={senderName} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                  {senderName.slice(0, 1).toUpperCase()}
                                </div>
                              )}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-sm font-semibold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                                {senderName}
                              </p>
                              <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                                sent you a friend request
                              </p>
                              <div className="mt-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    void onAcceptRequest(request._id);
                                  }}
                                  disabled={activeNotificationRequestId === request._id}
                                  className="rounded-lg bg-[#76C05D] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#67a94f] disabled:opacity-60"
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    void onRejectRequest(request._id);
                                  }}
                                  disabled={activeNotificationRequestId === request._id}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
                                    theme === "dark"
                                      ? "border border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                                      : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isNotificationLoading && notifications.length > 0 && (
                  <div className="px-4 py-3">
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                      Recent Activity
                    </p>
                    <div className="space-y-2">
                      {notifications.map((notification) => {
                        const actor = getNotificationActor(notification);
                        const actorName = `${actor?.firstName || ""} ${actor?.lastName || ""}`.trim() || actor?.username || "User";
                        const actorImage = profileImageUrl(actor?.profileUrl || actor?.profileImage);

                        return (
                          <button
                            key={notification._id}
                            onClick={() => {
                              if (!notification.isRead) void onMarkRead(notification._id);
                              if (actor?._id) router.push(`/user/profile/${actor._id}`);
                            }}
                            className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                              notification.isRead
                                ? theme === "dark"
                                  ? "border-zinc-800 bg-zinc-900"
                                  : "border-gray-200 bg-white"
                                : theme === "dark"
                                  ? "border-emerald-700/40 bg-zinc-800"
                                  : "border-green-200 bg-green-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-300 dark:bg-zinc-700">
                                {actorImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={actorImage} alt={actorName} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                    {actorName.slice(0, 1).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-sm font-semibold ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>
                                  {notification.title}
                                </p>
                                <p className={`line-clamp-2 text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                                  {notification.message}
                                </p>
                              </div>
                              {!notification.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-green-600" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isNotificationLoading && notifications.length === 0 && incomingRequests.length === 0 && messageAlerts.length === 0 && (
                  <p className={`px-4 py-6 text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                    No notifications.
                  </p>
                )}
              </div>

              <div className={`px-4 py-3 text-right ${theme === "dark" ? "border-t border-zinc-700" : "border-t border-gray-100"}`}>
                <Link
                  href="/user/friends"
                  className={`text-xs font-semibold ${theme === "dark" ? "text-emerald-300" : "text-green-700"}`}
                  onClick={() => setIsNotificationOpen(false)}
                >
                  Manage requests
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
