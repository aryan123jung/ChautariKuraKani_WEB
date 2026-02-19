"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import {
  handleCreateComment,
  handleDeleteComment,
  handleDeletePost,
  handleLikePost,
  handleUpdatePost,
} from "@/lib/actions/post-action";
import DeleteModal from "@/app/_components/DeleteModal";
import type { PostItem } from "../schema";
import CommentsModal from "./CommentsModal";

type PostUIState = {
  commentInput: string;
  isMenuOpen: boolean;
  isEditing: boolean;
  editCaption: string;
  editMedia: File | null;
  editPreview: string | null;
  isBusy: boolean;
};

const getAuthorId = (author: PostItem["authorId"]) => {
  if (!author) return "";
  if (typeof author === "string") return author;
  return author._id || "";
};

const getAuthorName = (author: PostItem["authorId"]) => {
  if (!author || typeof author === "string") return "User";
  const fullName = `${author.firstName || ""} ${author.lastName || ""}`.trim();
  return fullName || "User";
};

const getAuthorImage = (author: PostItem["authorId"]) => {
  if (!author || typeof author === "string") return null;
  return author.profileImage || author.profileUrl || null;
};

const buildMediaUrl = (mediaUrl: string, mediaType: "image" | "video") => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  const folder = mediaType === "video" ? "videos" : "images";
  return `${baseUrl}/uploads/posts/${folder}/${mediaUrl}`;
};

const profileImageUrl = (imageName: string | null) => {
  if (!imageName) return null;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${baseUrl}/uploads/profile/${imageName}`;
};

const initStateForPost = (post: PostItem): PostUIState => ({
  commentInput: "",
  isMenuOpen: false,
  isEditing: false,
  editCaption: post.caption || "",
  editMedia: null,
  editPreview: null,
  isBusy: false,
});

export default function ProfilePostsWidget({
  userId,
  currentUserProfileUrl,
  posts,
  onPostsChange,
}: {
  userId: string;
  currentUserProfileUrl?: string;
  posts: PostItem[];
  onPostsChange: (posts: PostItem[]) => void;
}) {
  const myPosts = useMemo(
    () => posts.filter((post) => getAuthorId(post.authorId) === userId),
    [posts, userId]
  );

  const [uiState, setUiState] = useState<Record<string, PostUIState>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePost, setDeletePost] = useState<PostItem | null>(null);
  const [commentsModalPostId, setCommentsModalPostId] = useState<string | null>(null);

  const getState = (post: PostItem) => uiState[post._id] || initStateForPost(post);

  const updateState = (postId: string, patch: Partial<PostUIState>) => {
    setUiState((prev) => {
      const current = prev[postId];
      const targetPost = posts.find((p) => p._id === postId);
      if (!targetPost && !current) return prev;

      const fallback = current ?? initStateForPost(targetPost!);

      return {
        ...prev,
        [postId]: {
          ...(current || fallback),
          ...patch,
        },
      };
    });
  };

  const hasCurrentUserLiked = (post: PostItem) => {
    const likes = post.likes || [];
    return likes.some((likedBy) => likedBy?.toString() === userId);
  };

  const getCommentUserId = (comment: NonNullable<PostItem["comments"]>[number]) => {
    if (!comment.userId) return "";
    if (typeof comment.userId === "string") return comment.userId;
    return comment.userId._id || "";
  };

  const onLike = async (post: PostItem) => {
    const state = getState(post);
    if (state.isBusy) return;

    updateState(post._id, { isBusy: true });
    try {
      const response = await handleLikePost(post._id);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to like post");
      }

      const updated = response.data as PostItem;
      onPostsChange(posts.map((p) => (p._id === post._id ? updated : p)));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to like post");
    } finally {
      updateState(post._id, { isBusy: false });
    }
  };

  const onAddComment = async (post: PostItem) => {
    const state = getState(post);
    const text = state.commentInput.trim();
    if (!text) return;

    updateState(post._id, { isBusy: true });
    try {
      const response = await handleCreateComment(post._id, text);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to add comment");
      }

      const updated = response.data as PostItem;
      onPostsChange(posts.map((p) => (p._id === post._id ? updated : p)));
      updateState(post._id, { commentInput: "" });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to add comment");
    } finally {
      updateState(post._id, { isBusy: false });
    }
  };

  const onDeleteComment = async (post: PostItem, commentId: string) => {
    const state = getState(post);
    if (state.isBusy) return;

    updateState(post._id, { isBusy: true });
    try {
      const response = await handleDeleteComment(post._id, commentId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to delete comment");
      }

      const updated = response.data as PostItem;
      onPostsChange(posts.map((p) => (p._id === post._id ? updated : p)));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete comment");
    } finally {
      updateState(post._id, { isBusy: false });
    }
  };

  const openCommentsModal = (postId: string) => {
    setCommentsModalPostId(postId);
  };

  const closeCommentsModal = () => {
    setCommentsModalPostId(null);
  };

  const activeCommentPost = commentsModalPostId
    ? posts.find((post) => post._id === commentsModalPostId) || null
    : null;

  const getCommentAuthorName = (
    comment: NonNullable<PostItem["comments"]>[number],
    post: PostItem
  ) => {
    const commentUserId = getCommentUserId(comment);
    if (commentUserId && commentUserId === userId) {
      return "You";
    }

    const postAuthorId = getAuthorId(post.authorId);
    if (commentUserId && commentUserId === postAuthorId) {
      return getAuthorName(post.authorId);
    }

    if (comment.userId && typeof comment.userId !== "string") {
      const fullName =
        `${comment.userId.firstName || ""} ${comment.userId.lastName || ""}`.trim();
      if (fullName) return fullName;
    }

    return "User";
  };

  const getCommentAvatarUrl = (
    comment: NonNullable<PostItem["comments"]>[number],
    post: PostItem
  ) => {
    const commentUserId = getCommentUserId(comment);
    if (commentUserId && commentUserId === userId) {
      return profileImageUrl(currentUserProfileUrl || null);
    }

    const postAuthorId = getAuthorId(post.authorId);
    if (commentUserId && commentUserId === postAuthorId) {
      return profileImageUrl(getAuthorImage(post.authorId));
    }

    if (comment.userId && typeof comment.userId !== "string") {
      const image = comment.userId.profileImage || comment.userId.profileUrl || null;
      return profileImageUrl(image);
    }

    return null;
  };

  const onEditPost = async (post: PostItem) => {
    const state = getState(post);
    const caption = state.editCaption.trim();

    if (!caption && !state.editMedia && !post.mediaUrl) {
      toast.error("Post must contain either caption or media");
      return;
    }

    updateState(post._id, { isBusy: true });

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (state.editMedia) {
        formData.append("media", state.editMedia);
      }

      const response = await handleUpdatePost(post._id, formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update post");
      }

      const updated = response.data as PostItem;
      onPostsChange(posts.map((p) => (p._id === post._id ? updated : p)));
      updateState(post._id, {
        isEditing: false,
        isMenuOpen: false,
        editMedia: null,
        editPreview: null,
        editCaption: updated.caption || "",
      });
      toast.success("Post updated");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update post");
    } finally {
      updateState(post._id, { isBusy: false });
    }
  };

  const onDeletePost = async (post: PostItem) => {
    updateState(post._id, { isBusy: true });

    try {
      const response = await handleDeletePost(post._id);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete post");
      }

      onPostsChange(posts.filter((p) => p._id !== post._id));
      toast.success("Post deleted");
    } catch (error: unknown) {
      updateState(post._id, { isBusy: false });
      toast.error(error instanceof Error ? error.message : "Failed to delete post");
    }
  };

  const handleDeleteConfirm = () => {
    if (deletePost) {
      void onDeletePost(deletePost);
    }
    setIsDeleteModalOpen(false);
    setDeletePost(null);
  };

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">Posts</h2>
        <span className="rounded-full bg-slate-100 dark:bg-zinc-900 px-3 py-1 text-sm text-slate-700 dark:text-zinc-300">
          {myPosts.length} total
        </span>
      </div>

      {myPosts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 p-8 text-center text-slate-500 dark:text-zinc-400">
          No posts yet. Click Add Post to share something.
        </div>
      )}

      <div className="space-y-5">
        {myPosts.map((post) => {
          const state = getState(post);
          const liked = hasCurrentUserLiked(post);
          const comments = post.comments || [];
          const authorImage =
            profileImageUrl(getAuthorImage(post.authorId)) ||
            profileImageUrl(currentUserProfileUrl || null);

          return (
            <article
              key={post._id}
              className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
            >
              <div className="p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                      {authorImage ? (
                        <Image src={authorImage} alt="Author" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600 dark:text-zinc-200">
                          {getAuthorName(post.authorId).slice(0, 1)}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900 dark:text-zinc-100">{getAuthorName(post.authorId)}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => updateState(post._id, { isMenuOpen: !state.isMenuOpen })}
                      className="rounded-full p-2 text-slate-500 dark:text-zinc-400 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {state.isMenuOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
                        <button
                          onClick={() =>
                            updateState(post._id, {
                              isEditing: true,
                              isMenuOpen: false,
                              editCaption: post.caption || "",
                            })
                          }
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                          Edit Post
                        </button>
                        <button
                          onClick={() => {
                            setDeletePost(post);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!state.isEditing && post.caption && (
                  <p className="mb-4 whitespace-pre-wrap text-[15px] leading-6 text-slate-800 dark:text-zinc-200">
                    {post.caption}
                  </p>
                )}

                {state.isEditing && (
                  <div className="mb-4 space-y-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-3">
                    <textarea
                      value={state.editCaption}
                      onChange={(e) => updateState(post._id, { editCaption: e.target.value })}
                      rows={3}
                      placeholder="Update your caption..."
                      className="w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-sm text-slate-900 dark:text-zinc-100 focus:border-slate-400 dark:focus:border-zinc-600 focus:outline-none"
                    />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        const preview = file ? URL.createObjectURL(file) : null;
                        updateState(post._id, { editMedia: file, editPreview: preview });
                      }}
                      className="w-full text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => updateState(post._id, { isEditing: false, editPreview: null, editMedia: null })}
                        className="rounded-lg bg-slate-200 dark:bg-zinc-700 px-3 py-1.5 text-sm text-slate-700 dark:text-zinc-100 hover:bg-slate-300 dark:hover:bg-zinc-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => void onEditPost(post)}
                        disabled={state.isBusy}
                        className="rounded-lg bg-slate-900 dark:bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-slate-800 dark:hover:bg-zinc-600 disabled:opacity-60"
                      >
                        {state.isBusy ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!state.isEditing && post.mediaUrl && post.mediaType === "image" && (
                <div className="relative h-[24rem] w-full bg-slate-100 dark:bg-zinc-800">
                  <Image
                    src={buildMediaUrl(post.mediaUrl, "image")}
                    alt="Post media"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {!state.isEditing && post.mediaUrl && post.mediaType === "video" && (
                <video src={buildMediaUrl(post.mediaUrl, "video")} controls className="w-full bg-black" />
              )}

              {state.isEditing && state.editPreview && (
                <div className="px-4 pb-4">
                  {state.editMedia?.type.startsWith("image/") ? (
                    <Image
                      src={state.editPreview}
                      alt="Preview"
                      width={1200}
                      height={800}
                      unoptimized
                      className="max-h-80 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <video src={state.editPreview} controls className="max-h-80 w-full rounded-xl" />
                  )}
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-zinc-800 p-3">
                <div className="mb-2 flex items-center justify-between px-1 text-xs text-slate-500 dark:text-zinc-400">
                  <span>{post.likes?.length || 0} likes</span>
                  <span>{post.commentsCount ?? comments.length} comments</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onLike(post)}
                    disabled={state.isBusy}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                      liked
                        ? "bg-blue-50 dark:bg-zinc-700 text-blue-600 dark:text-emerald-300"
                        : "text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    } disabled:opacity-60`}
                  >
                    <Heart size={16} />
                    Like
                  </button>

                  <button
                    onClick={() => openCommentsModal(post._id)}
                    className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    <MessageCircle size={16} />
                    Comment ({post.commentsCount ?? comments.length})
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletePost(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
      />

      <CommentsModal
        isOpen={Boolean(activeCommentPost)}
        onClose={closeCommentsModal}
        comments={activeCommentPost?.comments || []}
        commentInput={
          activeCommentPost ? getState(activeCommentPost).commentInput : ""
        }
        onCommentInputChange={(value) => {
          if (!activeCommentPost) return;
          updateState(activeCommentPost._id, { commentInput: value });
        }}
        onSubmitComment={() => {
          if (!activeCommentPost) return;
          void onAddComment(activeCommentPost);
        }}
        onDeleteComment={(commentId) => {
          if (!activeCommentPost) return;
          void onDeleteComment(activeCommentPost, commentId);
        }}
        canDeleteComment={(comment) =>
          !!activeCommentPost &&
          (getCommentUserId(comment) === userId ||
            getAuthorId(activeCommentPost.authorId) === userId)
        }
        getCommentAuthorName={(comment) =>
          activeCommentPost
            ? getCommentAuthorName(comment, activeCommentPost)
            : "User"
        }
        getCommentAvatarUrl={(comment) =>
          activeCommentPost ? getCommentAvatarUrl(comment, activeCommentPost) : null
        }
        isBusy={
          activeCommentPost ? getState(activeCommentPost).isBusy : false
        }
      />
    </section>
  );
}
