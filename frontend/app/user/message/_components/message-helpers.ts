import type { FriendUser, MessageUser } from "./message-types";

export const getUserId = (user: string | MessageUser | FriendUser | null | undefined) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id || "";
};

export const getUserName = (user: string | MessageUser | FriendUser | null | undefined) => {
  if (!user || typeof user === "string") return "User";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
};

export const getUserAvatar = (user: string | MessageUser | FriendUser | null | undefined) => {
  if (!user || typeof user === "string") return null;
  return user.profileUrl || null;
};

export const buildProfileImageUrl = (profileUrl?: string | null) => {
  if (!profileUrl) return null;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${backendUrl}/uploads/profile/${profileUrl}`;
};

export const formatCallDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) return "00:00";
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export const getAuthTokenFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};
