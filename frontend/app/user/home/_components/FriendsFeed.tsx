"use client";

import type { PostItem } from "@/app/user/profile/schema";
import {
  handleCreateComment,
  handleDeleteComment,
  handleLikePost,
} from "@/lib/actions/post-action";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import CommentsModal from "@/app/user/profile/_components/CommentsModal";

const getAuthorId = (author: PostItem["authorId"]) => {
  if (!author) return "";
  if (typeof author === "string") return author;
  return author._id || "";
};

const getAuthorName = (author: PostItem["authorId"]) => {
  if (!author || typeof author === "string") return "User";
  return `${author.firstName || ""} ${author.lastName || ""}`.trim() || "User";
};

const getAuthorImage = (author: PostItem["authorId"]) => {
  if (!author || typeof author === "string") return null;
  return author.profileUrl || author.profileImage || null;
};

const buildProfileImageUrl = (profileUrl?: string | null) => {
  if (!profileUrl) return null;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${backendUrl}/uploads/profile/${profileUrl}`;
};

const buildMediaUrl = (mediaUrl: string, mediaType: "image" | "video") => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  const folder = mediaType === "video" ? "videos" : "images";
  return `${backendUrl}/uploads/posts/${folder}/${mediaUrl}`;
};

export default function FriendsFeed({
  viewerUserId,
  friendIds,
  posts,
  onPostsChange,
}: {
  viewerUserId: string;
  friendIds: string[];
  posts: PostItem[];
  onPostsChange: (posts: PostItem[]) => void;
}) {
  const [busyPostId, setBusyPostId] = useState<string | null>(null);
  const [commentsModalPostId, setCommentsModalPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const friendIdSet = new Set(friendIds);
  const filteredPosts = posts.filter((post) =>
    friendIdSet.has(getAuthorId(post.authorId))
  );

  const activeCommentPost = commentsModalPostId
    ? posts.find((post) => post._id === commentsModalPostId) || null
    : null;

  const hasLiked = (post: PostItem) =>
    (post.likes || []).some((likedBy) => likedBy?.toString() === viewerUserId);

  const getCommentUserId = (comment: NonNullable<PostItem["comments"]>[number]) => {
    if (!comment.userId) return "";
    if (typeof comment.userId === "string") return comment.userId;
    return comment.userId._id || "";
  };

  const getCommentAuthorName = (
    comment: NonNullable<PostItem["comments"]>[number],
    post: PostItem
  ) => {
    const commentUserId = getCommentUserId(comment);
    if (commentUserId && commentUserId === viewerUserId) return "You";

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
    const postAuthorId = getAuthorId(post.authorId);

    if (commentUserId && commentUserId === postAuthorId) {
      return buildProfileImageUrl(getAuthorImage(post.authorId));
    }

    if (comment.userId && typeof comment.userId !== "string") {
      return buildProfileImageUrl(comment.userId.profileUrl || comment.userId.profileImage);
    }

    return null;
  };

  const onLike = async (postId: string) => {
    if (busyPostId) return;
    setBusyPostId(postId);
    try {
      const response = await handleLikePost(postId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to like post");
      }

      const updatedPost = response.data as PostItem;
      onPostsChange(posts.map((post) => (post._id === postId ? updatedPost : post)));
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

      const updatedPost = response.data as PostItem;
      onPostsChange(
        posts.map((post) => (post._id === commentsModalPostId ? updatedPost : post))
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

      const updatedPost = response.data as PostItem;
      onPostsChange(
        posts.map((post) => (post._id === commentsModalPostId ? updatedPost : post))
      );
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete comment");
    } finally {
      setBusyPostId(null);
    }
  };

  if (filteredPosts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
        No posts from friends yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => {
        const authorName = getAuthorName(post.authorId);
        const authorImage = buildProfileImageUrl(getAuthorImage(post.authorId));

        return (
          <article
            key={post._id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                  {authorImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={authorImage} alt={authorName} className="h-full w-full object-cover" />
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

              {post.caption && (
                <p className="mb-3 whitespace-pre-wrap text-sm text-slate-800 dark:text-zinc-200">
                  {post.caption}
                </p>
              )}
            </div>

            {post.mediaUrl && post.mediaType === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={buildMediaUrl(post.mediaUrl, "image")}
                alt="Post media"
                className="max-h-[32rem] w-full object-cover"
              />
            )}

            {post.mediaUrl && post.mediaType === "video" && (
              <video src={buildMediaUrl(post.mediaUrl, "video")} controls className="w-full bg-black" />
            )}

            <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
              <div className="mb-2 flex items-center justify-between">
                <span>{post.likes?.length || 0} likes</span>
                <span>{post.commentsCount || post.comments?.length || 0} comments</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => void onLike(post._id)}
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
      })}

      <CommentsModal
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
        canDeleteComment={(comment) =>
          !!activeCommentPost &&
          (getCommentUserId(comment) === viewerUserId ||
            getAuthorId(activeCommentPost.authorId) === viewerUserId)
        }
        getCommentAuthorName={(comment) =>
          activeCommentPost
            ? getCommentAuthorName(comment, activeCommentPost)
            : "User"
        }
        getCommentAvatarUrl={(comment) =>
          activeCommentPost ? getCommentAvatarUrl(comment, activeCommentPost) : null
        }
        isBusy={Boolean(busyPostId)}
      />
    </div>
  );
}
