"use client";

import {
  handleCreateChautari,
  handleCreateChautariPost,
  handleDeleteChautari,
  handleGetChautariById,
  handleGetChautariMemberCount,
  handleGetChautariPosts,
  handleJoinChautari,
  handleLeaveChautari,
  handleUpdateChautari,
} from "@/lib/actions/chautari-action";
import {
  handleCreateComment,
  handleDeleteComment,
  handleDeletePost,
  handleLikePost,
  handleUpdatePost,
} from "@/lib/actions/post-action";
import { Loader2, MessageCircle, Pencil, ThumbsUp, Trash2, Users } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type {
  CommunityItem,
  CommunityPost,
  CommunityPostComment,
  CommunityUser,
} from "../schema";
import CommunityCommentsModal from "./CommunityCommentsModal";
import CreateCommunityModal from "./CreateCommunityModal";
import CreateChautariPostModal from "./CreateChautariPostModal";
import DeleteModal from "./DeleteModal";
import EditCommunityModal from "./EditCommunityModal";
import EditChautariPostModal from "./EditChautariPostModal";
import MyChautariSidebar from "./MyChautariSidebar";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
const MY_CHAUTARI_IDS_KEY = "my_chautari_ids";

const getEntityId = (entity?: string | CommunityUser | CommunityItem | null) => {
  if (!entity) return "";
  if (typeof entity === "string") return entity;
  return entity._id || "";
};

const getUserName = (user?: string | CommunityUser) => {
  if (!user || typeof user === "string") return "User";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return fullName || user.username || "User";
};

const buildProfileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  return `${BACKEND_URL}/uploads/profile/${profileUrl}`;
};

const buildCommunityProfileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  return `${BACKEND_URL}/uploads/chautari/profile/${profileUrl}`;
};

const buildPostMediaUrl = (mediaUrl?: string, mediaType?: "image" | "video") => {
  if (!mediaUrl || !mediaType) return null;
  const folder = mediaType === "video" ? "videos" : "images";
  return `${BACKEND_URL}/uploads/posts/${folder}/${mediaUrl}`;
};

const normalizeCommunityName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "";
  if (trimmed.toLowerCase().startsWith("c/")) return trimmed;
  return `c/${trimmed}`;
};

export default function ChautariClient({
  currentUserId,
  initialCommunityId = "",
}: {
  currentUserId: string;
  initialCommunityId?: string;
}) {

  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const [myCommunities, setMyCommunities] = useState<CommunityItem[]>([]);

  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [joiningOrLeaving, setJoiningOrLeaving] = useState(false);
  const [deletingCommunity, setDeletingCommunity] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [deletePostTargetId, setDeletePostTargetId] = useState<string | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [isSavingEditPost, setIsSavingEditPost] = useState(false);

  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [newCommunityProfileFile, setNewCommunityProfileFile] = useState<File | null>(null);
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [isEditCommunityOpen, setIsEditCommunityOpen] = useState(false);
  const [editCommunityName, setEditCommunityName] = useState("");
  const [editCommunityDescription, setEditCommunityDescription] = useState("");
  const [editCommunityProfileFile, setEditCommunityProfileFile] = useState<File | null>(null);
  const [updatingCommunity, setUpdatingCommunity] = useState(false);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postModalSession, setPostModalSession] = useState(0);
  const [creatingPost, setCreatingPost] = useState(false);
  const [busyPostId, setBusyPostId] = useState<string | null>(null);
  const [commentsModalPostId, setCommentsModalPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const isJoined = useMemo(() => {
    const members = selectedCommunity?.members || [];
    return members.some((member) => getEntityId(member) === currentUserId);
  }, [selectedCommunity, currentUserId]);

  const isCreator = useMemo(() => {
    if (!selectedCommunity) return false;
    return getEntityId(selectedCommunity.creatorId) === currentUserId;
  }, [selectedCommunity, currentUserId]);

  const activeCommentPost = commentsModalPostId
    ? posts.find((post) => post._id === commentsModalPostId) || null
    : null;

  const persistMyCommunityIds = (items: CommunityItem[]) => {
    if (typeof window === "undefined") return;
    const ids = items.map((item) => item._id).filter(Boolean);
    window.localStorage.setItem(MY_CHAUTARI_IDS_KEY, JSON.stringify(ids));
  };

  const upsertMyCommunity = (community: CommunityItem) => {
    const joined = (community.members || []).some(
      (member) => getEntityId(member) === currentUserId
    );
    const creator = getEntityId(community.creatorId) === currentUserId;

    setMyCommunities((prev) => {
      const exists = prev.some((item) => item._id === community._id);

      if (!joined && !creator) {
        const filtered = prev.filter((item) => item._id !== community._id);
        persistMyCommunityIds(filtered);
        return filtered;
      }

      const next = exists
        ? prev.map((item) => (item._id === community._id ? community : item))
        : [community, ...prev];

      persistMyCommunityIds(next);
      return next;
    });
  };

  const removeCommunityFromLocalState = (communityId: string) => {
    setMyCommunities((prev) => {
      const next = prev.filter((item) => item._id !== communityId);
      persistMyCommunityIds(next);
      return next;
    });

    if (selectedCommunityId === communityId) {
      setSelectedCommunityId(null);
      setSelectedCommunity(null);
      setPosts([]);
      setMemberCount(0);
    }
  };

  const loadCommunity = async (communityId: string) => {
    setLoadingCommunity(true);
    try {
      const [communityResponse, memberCountResponse, postsResponse] = await Promise.all([
        handleGetChautariById(communityId),
        handleGetChautariMemberCount(communityId),
        handleGetChautariPosts(communityId, 1, 50),
      ]);

      if (!communityResponse.success || !communityResponse.data) {
        throw new Error(communityResponse.message || "Community not found");
      }

      const community = communityResponse.data as CommunityItem;
      setSelectedCommunity(community);
      setMemberCount(Number(memberCountResponse.data?.count || 0));
      setPosts((postsResponse.data || []) as CommunityPost[]);
      upsertMyCommunity(community);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load community");
    } finally {
      setLoadingCommunity(false);
    }
  };

  const onSelectCommunity = async (communityId: string) => {
    if (loadingCommunity || selectedCommunityId === communityId) return;
    setSelectedCommunityId(communityId);
    await loadCommunity(communityId);
  };

  const onCreateCommunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creatingCommunity) return;

    const normalizedName = normalizeCommunityName(newCommunityName);
    if (!normalizedName) {
      toast.error("Community name is required");
      return;
    }

    setCreatingCommunity(true);
    try {
      const formData = new FormData();
      formData.append("name", normalizedName);
      if (newCommunityDescription.trim()) {
        formData.append("description", newCommunityDescription.trim());
      }
      if (newCommunityProfileFile) {
        formData.append("communityProfileUrl", newCommunityProfileFile);
      }

      const response = await handleCreateChautari(formData);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create community");
      }

      const created = response.data as CommunityItem;
      toast.success(response.message || "Community created");
      setIsCreateCommunityOpen(false);
      setNewCommunityName("");
      setNewCommunityDescription("");
      setNewCommunityProfileFile(null);

      setSelectedCommunityId(created._id);
      await loadCommunity(created._id);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create community");
    } finally {
      setCreatingCommunity(false);
    }
  };

  const onJoinOrLeave = async () => {
    if (!selectedCommunityId || joiningOrLeaving) return;

    setJoiningOrLeaving(true);
    try {
      const response = isJoined
        ? await handleLeaveChautari(selectedCommunityId)
        : await handleJoinChautari(selectedCommunityId);

      if (!response.success) {
        throw new Error(response.message || (isJoined ? "Leave failed" : "Join failed"));
      }

      toast.success(response.message || (isJoined ? "Left community" : "Joined community"));
      await loadCommunity(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setJoiningOrLeaving(false);
    }
  };

  const onOpenEditCommunity = () => {
    if (!selectedCommunity || !isCreator) return;
    setEditCommunityName(selectedCommunity.name || (selectedCommunity.slug ? `c/${selectedCommunity.slug}` : ""));
    setEditCommunityDescription(selectedCommunity.description || "");
    setEditCommunityProfileFile(null);
    setIsEditCommunityOpen(true);
  };

  const onUpdateCommunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCommunityId || !isCreator || updatingCommunity) return;

    const normalizedName = normalizeCommunityName(editCommunityName);
    const originalName = selectedCommunity?.name || (selectedCommunity?.slug ? `c/${selectedCommunity.slug}` : "");
    const trimmedDescription = editCommunityDescription.trim();
    const originalDescription = (selectedCommunity?.description || "").trim();

    const hasNameChange = normalizedName && normalizedName !== originalName;
    const hasDescriptionChange = trimmedDescription !== originalDescription;
    const hasImageChange = Boolean(editCommunityProfileFile);

    if (!hasNameChange && !hasDescriptionChange && !hasImageChange) {
      toast.error("No changes to update");
      return;
    }

    setUpdatingCommunity(true);
    try {
      const formData = new FormData();
      if (hasNameChange) formData.append("name", normalizedName);
      if (hasDescriptionChange) formData.append("description", trimmedDescription);
      if (editCommunityProfileFile) {
        formData.append("communityProfileUrl", editCommunityProfileFile);
      }

      const response = await handleUpdateChautari(selectedCommunityId, formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update community");
      }

      toast.success(response.message || "Community updated");
      setIsEditCommunityOpen(false);
      setEditCommunityProfileFile(null);
      await loadCommunity(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update community");
    } finally {
      setUpdatingCommunity(false);
    }
  };

  const onDeleteCommunity = async () => {
    if (!selectedCommunityId || deletingCommunity || !isCreator) return;

    setDeletingCommunity(true);
    try {
      const response = await handleDeleteChautari(selectedCommunityId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete community");
      }

      toast.success(response.message || "Community deleted");
      removeCommunityFromLocalState(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete community");
    } finally {
      setDeletingCommunity(false);
    }
  };

  const canDeletePost = (post: CommunityPost) => {
    const postAuthorId = getEntityId(post.authorId);
    return postAuthorId === currentUserId || isCreator;
  };

  const canEditPost = (post: CommunityPost) => {
    const postAuthorId = getEntityId(post.authorId);
    return postAuthorId === currentUserId;
  };

  const onDeletePost = async (postId: string) => {
    if (!postId || isDeletingPost) return;

    setIsDeletingPost(true);
    try {
      const response = await handleDeletePost(postId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete post");
      }

      toast.success(response.message || "Post deleted");
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setCommentsModalPostId((prev) => (prev === postId ? null : prev));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete post");
    } finally {
      setIsDeletingPost(false);
    }
  };

  const onCreatePost = async ({
    caption,
    file,
  }: {
    caption: string;
    file: File | null;
  }) => {
    if (!selectedCommunityId || creatingPost) return;

    const trimmedCaption = caption.trim();
    if (!trimmedCaption && !file) {
      toast.error("Post must contain either caption or media");
      return;
    }

    const formData = new FormData();
    if (trimmedCaption) formData.append("caption", trimmedCaption);
    if (file) formData.append("media", file);

    setCreatingPost(true);
    try {
      const response = await handleCreateChautariPost(selectedCommunityId, formData);
      if (!response.success) {
        throw new Error(response.message || "Failed to create post");
      }

      toast.success(response.message || "Post created");
      setIsCreatePostOpen(false);
      await loadCommunity(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setCreatingPost(false);
    }
  };

  const onEditPost = async ({
    caption,
    file,
  }: {
    caption: string;
    file: File | null;
  }) => {
    if (!editingPost || isSavingEditPost) return;

    const trimmedCaption = caption.trim();
    if (!trimmedCaption && !file && !editingPost.mediaUrl) {
      toast.error("Post must contain either caption or media");
      return;
    }

    setIsSavingEditPost(true);
    try {
      const formData = new FormData();
      formData.append("caption", trimmedCaption);
      if (file) formData.append("media", file);

      const response = await handleUpdatePost(editingPost._id, formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update post");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) =>
        prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
      toast.success(response.message || "Post updated");
      setEditingPost(null);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update post");
    } finally {
      setIsSavingEditPost(false);
    }
  };

  const hasLiked = (post: CommunityPost) =>
    (post.likes || []).some((likedBy) => likedBy?.toString() === currentUserId);

  const getCommentUserId = (comment: CommunityPostComment) => {
    if (!comment.userId) return "";
    if (typeof comment.userId === "string") return comment.userId;
    return comment.userId._id || "";
  };

  const getCommentAuthorName = (comment: CommunityPostComment) => {
    const commentUserId = getCommentUserId(comment);
    if (commentUserId && commentUserId === currentUserId) return "You";

    if (comment.userId && typeof comment.userId !== "string") {
      const fullName = `${comment.userId.firstName || ""} ${comment.userId.lastName || ""}`.trim();
      if (fullName) return fullName;
    }

    return "User";
  };

  const getCommentAvatarUrl = (comment: CommunityPostComment) => {
    if (comment.userId && typeof comment.userId !== "string") {
      return buildProfileImageUrl(comment.userId.profileUrl || comment.userId.profileImage);
    }
    return null;
  };

  const canDeleteComment = (comment: CommunityPostComment) => {
    const commentUserId = getCommentUserId(comment);
    const postOwnerId = activeCommentPost ? getEntityId(activeCommentPost.authorId) : "";
    return commentUserId === currentUserId || postOwnerId === currentUserId;
  };

  const onLikePost = async (postId: string) => {
    if (busyPostId) return;
    setBusyPostId(postId);
    try {
      const response = await handleLikePost(postId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to like post");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) => prev.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to like post");
    } finally {
      setBusyPostId(null);
    }
  };

  const onOpenComments = (postId: string) => {
    setCommentsModalPostId(postId);
    setCommentInput("");
  };

  const onSubmitComment = async () => {
    if (!commentsModalPostId || busyPostId) return;
    const text = commentInput.trim();
    if (!text) return;

    setBusyPostId(commentsModalPostId);
    try {
      const response = await handleCreateComment(commentsModalPostId, text);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to add comment");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) =>
        prev.map((post) => (post._id === commentsModalPostId ? updatedPost : post))
      );
      setCommentInput("");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to add comment");
    } finally {
      setBusyPostId(null);
    }
  };

  const onDeleteCommentForPost = async (commentId: string) => {
    if (!commentsModalPostId || busyPostId) return;
    setBusyPostId(commentsModalPostId);
    try {
      const response = await handleDeleteComment(commentsModalPostId, commentId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to delete comment");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) =>
        prev.map((post) => (post._id === commentsModalPostId ? updatedPost : post))
      );
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete comment");
    } finally {
      setBusyPostId(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(MY_CHAUTARI_IDS_KEY);
    if (!raw) return;

    let ids: string[] = [];
    try {
      ids = JSON.parse(raw) as string[];
    } catch {
      ids = [];
    }

    if (!ids.length) return;

    void Promise.all(ids.map((id) => handleGetChautariById(id))).then((responses) => {
      const communities = responses
        .filter((response) => response.success && response.data)
        .map((response) => response.data as CommunityItem);

      setMyCommunities(communities);
      persistMyCommunityIds(communities);
    });
  }, []);

  useEffect(() => {
    if (!initialCommunityId) return;
    setSelectedCommunityId(initialCommunityId);
    void loadCommunity(initialCommunityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCommunityId]);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden p-4">
      <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">

        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:order-2 dark:border-zinc-800 dark:bg-zinc-900">
          {!selectedCommunity && (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
              Select a Chautari to view posts.
            </div>
          )}

          {selectedCommunity && (
            <>
              <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-700 dark:bg-zinc-950">
                {loadingCommunity ? (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300">
                    <Loader2 size={16} className="animate-spin" />
                    Loading community...
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {(() => {
                          const selectedCommunityAvatar = buildCommunityProfileImageUrl(
                            selectedCommunity.profileUrl
                          );
                          return (
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                          {selectedCommunityAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={selectedCommunityAvatar}
                              alt={selectedCommunity.name || selectedCommunity.slug || "Community"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700 dark:text-zinc-200">
                              {(selectedCommunity.name || selectedCommunity.slug || "C")
                                .slice(0, 1)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                          );
                        })()}
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                            {selectedCommunity.name ||
                              (selectedCommunity.slug ? `c/${selectedCommunity.slug}` : "c/community")}
                          </h2>
                          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                            {selectedCommunity.description || "No description provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPostModalSession((prev) => prev + 1);
                            setIsCreatePostOpen(true);
                          }}
                          disabled={!isJoined}
                          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                        >
                          Add Post
                        </button>
                        {isCreator && (
                          <button
                            type="button"
                            onClick={onOpenEditCommunity}
                            disabled={updatingCommunity}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                        )}
                        {isCreator && (
                          <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={deletingCommunity}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
                          >
                            <Trash2 size={14} />
                            {deletingCommunity ? "Deleting..." : "Delete"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => void onJoinOrLeave()}
                          disabled={joiningOrLeaving}
                          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            isJoined
                              ? "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                              : "bg-slate-900 text-white hover:bg-slate-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                          } disabled:opacity-60`}
                        >
                          {joiningOrLeaving ? "Please wait..." : isJoined ? "Leave" : "Join"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} />
                        {memberCount} members
                      </span>
                      <span>
                        Created{" "}
                        {selectedCommunity.createdAt
                          ? new Date(selectedCommunity.createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-feed pr-1">
                <div className="space-y-3">
                  {posts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
                      No posts in this community yet.
                    </div>
                  ) : (
                    posts.map((post) => {
                      const authorName = getUserName(post.authorId);
                      const authorAvatar =
                        post.authorId && typeof post.authorId !== "string"
                          ? buildProfileImageUrl(post.authorId.profileUrl)
                          : null;
                      const mediaUrl = buildPostMediaUrl(post.mediaUrl, post.mediaType);

                      return (
                        <article
                          key={post._id}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="p-4">
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                                {authorAvatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={authorAvatar} alt={authorName} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    {authorName.slice(0, 1).toUpperCase()}
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                                  {authorName}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                                </p>
                              </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {canEditPost(post) && (
                                  <button
                                    type="button"
                                    onClick={() => setEditingPost(post)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                  >
                                    <Pencil size={12} />
                                    Edit
                                  </button>
                                )}
                                {canDeletePost(post) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeletePostTargetId(post._id);
                                      setIsDeletePostModalOpen(true);
                                    }}
                                    className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>

                            {post.caption && (
                              <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-zinc-200">
                                {post.caption}
                              </p>
                            )}
                          </div>

                          {mediaUrl && post.mediaType === "image" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={mediaUrl}
                              alt="Community post media"
                              className="max-h-[32rem] w-full object-cover"
                            />
                          )}

                          {mediaUrl && post.mediaType === "video" && (
                            <video src={mediaUrl} controls className="w-full bg-black" />
                          )}

                          <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                            <div className="mb-2 flex items-center justify-between">
                              <span>{post.likes?.length || 0} likes</span>
                              <span>{post.commentsCount || post.comments?.length || 0} comments</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => void onLikePost(post._id)}
                                disabled={busyPostId === post._id}
                                className={`flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition ${
                                  hasLiked(post)
                                    ? "bg-green-50 text-green-700 dark:bg-zinc-700 dark:text-green-300"
                                    : "hover:bg-slate-100 dark:hover:bg-zinc-800"
                                } disabled:opacity-60`}
                              >
                                <ThumbsUp size={14} />
                                Like
                              </button>
                              <button
                                onClick={() => onOpenComments(post._id)}
                                disabled={busyPostId === post._id}
                                className="flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold transition hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-60"
                              >
                                <MessageCircle size={14} />
                                Comment
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </section>

        <MyChautariSidebar
          myCommunities={myCommunities}
          currentUserId={currentUserId}
          selectedCommunityId={selectedCommunityId}
          onSelectCommunity={(communityId) => void onSelectCommunity(communityId)}
          onOpenCreate={() => setIsCreateCommunityOpen(true)}
        />
      </div>

      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        creatingCommunity={creatingCommunity}
        newCommunityName={newCommunityName}
        newCommunityDescription={newCommunityDescription}
        newCommunityProfileFile={newCommunityProfileFile}
        onClose={() => setIsCreateCommunityOpen(false)}
        onSubmit={(event) => void onCreateCommunity(event)}
        onNameChange={setNewCommunityName}
        onDescriptionChange={setNewCommunityDescription}
        onProfileFileChange={setNewCommunityProfileFile}
      />

      <EditCommunityModal
        isOpen={isEditCommunityOpen}
        updatingCommunity={updatingCommunity}
        communityName={editCommunityName}
        communityDescription={editCommunityDescription}
        communityProfileFile={editCommunityProfileFile}
        onClose={() => {
          setIsEditCommunityOpen(false);
          setEditCommunityProfileFile(null);
        }}
        onSubmit={(event) => void onUpdateCommunity(event)}
        onNameChange={setEditCommunityName}
        onDescriptionChange={setEditCommunityDescription}
        onProfileFileChange={setEditCommunityProfileFile}
      />

      <CreateChautariPostModal
        key={postModalSession}
        isOpen={isCreatePostOpen}
        isJoined={isJoined}
        creatingPost={creatingPost}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={(payload) => void onCreatePost(payload)}
      />

      <CommunityCommentsModal
        isOpen={Boolean(activeCommentPost)}
        onClose={() => {
          setCommentsModalPostId(null);
          setCommentInput("");
        }}
        comments={activeCommentPost?.comments || []}
        commentInput={commentInput}
        onCommentInputChange={setCommentInput}
        onSubmitComment={() => void onSubmitComment()}
        onDeleteComment={(commentId) => void onDeleteCommentForPost(commentId)}
        canDeleteComment={canDeleteComment}
        getCommentAuthorName={getCommentAuthorName}
        getCommentAvatarUrl={getCommentAvatarUrl}
        isBusy={busyPostId === commentsModalPostId}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => void onDeleteCommunity()}
        title="Delete Chautari"
        description={`Are you sure you want to delete ${selectedCommunity?.name || selectedCommunity?.slug || "this community"}?`}
      />

      <DeleteModal
        isOpen={isDeletePostModalOpen}
        onClose={() => {
          setIsDeletePostModalOpen(false);
          setDeletePostTargetId(null);
        }}
        onConfirm={() => {
          if (deletePostTargetId) {
            void onDeletePost(deletePostTargetId);
          }
        }}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
      />

      <EditChautariPostModal
        key={`edit-post-${editingPost?._id || "none"}-${editingPost?.caption || ""}`}
        isOpen={Boolean(editingPost)}
        isSaving={isSavingEditPost}
        initialCaption={editingPost?.caption || ""}
        onClose={() => setEditingPost(null)}
        onSubmit={(payload) => void onEditPost(payload)}
      />
    </div>
  );
}
