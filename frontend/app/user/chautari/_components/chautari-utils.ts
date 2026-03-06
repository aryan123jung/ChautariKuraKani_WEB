import type { CommunityItem, CommunityPostComment, CommunityUser } from "../schema";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
export const MY_CHAUTARI_IDS_KEY = "my_chautari_ids";

export const getEntityId = (entity?: string | CommunityUser | CommunityItem | null) => {
  if (!entity) return "";
  if (typeof entity === "string") return entity;
  return entity._id || "";
};

export const getUserName = (user?: string | CommunityUser) => {
  if (!user || typeof user === "string") return "User";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return fullName || user.username || "User";
};

export const buildProfileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  return `${BACKEND_URL}/uploads/profile/${profileUrl}`;
};

export const buildCommunityProfileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  return `${BACKEND_URL}/uploads/chautari/profile/${profileUrl}`;
};

export const buildPostMediaUrl = (mediaUrl?: string, mediaType?: "image" | "video") => {
  if (!mediaUrl || !mediaType) return null;
  const folder = mediaType === "video" ? "videos" : "images";
  return `${BACKEND_URL}/uploads/posts/${folder}/${mediaUrl}`;
};

export const normalizeCommunityName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "";
  if (trimmed.toLowerCase().startsWith("c/")) return trimmed;
  return `c/${trimmed}`;
};

export const getCommentUserId = (comment: CommunityPostComment) => {
  if (!comment.userId) return "";
  if (typeof comment.userId === "string") return comment.userId;
  return comment.userId._id || "";
};

export const getCommentAuthorName = (comment: CommunityPostComment, currentUserId: string) => {
  const commentUserId = getCommentUserId(comment);
  if (commentUserId && commentUserId === currentUserId) return "You";

  if (comment.userId && typeof comment.userId !== "string") {
    const fullName = `${comment.userId.firstName || ""} ${comment.userId.lastName || ""}`.trim();
    if (fullName) return fullName;
  }

  return "User";
};

export const getCommentAvatarUrl = (comment: CommunityPostComment) => {
  if (comment.userId && typeof comment.userId !== "string") {
    return buildProfileImageUrl(comment.userId.profileUrl || comment.userId.profileImage);
  }
  return null;
};

