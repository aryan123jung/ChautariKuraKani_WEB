"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteModal from "@/app/_components/DeleteModal";
import { handleDeleteAdminPost, handleGetAdminPosts } from "@/lib/actions/admin/post-action";

type AdminPost = {
  _id: string;
  caption?: string;
  mediaType?: string;
  mediaUrl?: string;
  createdAt?: string;
  authorId?: string | { _id?: string; username?: string; firstName?: string; lastName?: string; profileUrl?: string };
  likes?: unknown[];
  commentsCount?: number;
};

type Pagination = {
  page: number;
  size: number;
  total?: number;
  totalPosts?: number;
  totalPages: number;
};

const getAuthorLabel = (author: AdminPost["authorId"]) => {
  if (!author) return "-";
  if (typeof author === "string") return author;
  const fullName = `${author.firstName || ""} ${author.lastName || ""}`.trim();
  return author.username ? `@${author.username}` : fullName || author._id || "-";
};

const getAuthorId = (author: AdminPost["authorId"]) => {
  if (!author) return "";
  if (typeof author === "string") return author;
  return author._id || "";
};

const getAuthorProfile = (author: AdminPost["authorId"]) => {
  if (!author || typeof author === "string") return "";
  return author.profileUrl ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060"}/uploads/profile/${author.profileUrl}` : "";
};

export default function AdminPostsPage() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  const buildPostMediaUrl = (mediaUrl: string, mediaType: string) =>
    `${backendUrl}/uploads/posts/${mediaType === "video" ? "videos" : "images"}/${mediaUrl}`;

  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    totalPages: 1,
    totalPosts: 0,
  });
  const [deleteTarget, setDeleteTarget] = useState<AdminPost | null>(null);

  const loadPosts = async (page = pagination.page, size = pagination.size) => {
    setLoading(true);
    const response = await handleGetAdminPosts(page, size);
    setLoading(false);
    if (!response.success) {
      toast.error(response.message || "Failed to load posts");
      return;
    }
    setPosts((response.data as AdminPost[]) || []);
    setPagination(
      (response.pagination as Pagination) || {
        page,
        size,
        totalPages: 1,
        totalPosts: response.data?.length || 0,
      }
    );
  };

  useEffect(() => {
    void loadPosts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async () => {
    if (!deleteTarget) return;
    const response = await handleDeleteAdminPost(deleteTarget._id);
    if (!response.success) {
      toast.error(response.message || "Failed to delete post");
      return;
    }
    toast.success(response.message || "Post deleted");
    setDeleteTarget(null);
    await loadPosts();
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">All User Posts</h1>
        <button
          onClick={() => void loadPosts()}
          className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-500">
          Loading posts...
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-500">
          No posts found
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="max-h-[72vh] overflow-y-auto rounded-lg border bg-slate-50 p-3">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {posts.map((post) => {
              const authorLabel = getAuthorLabel(post.authorId);
              const authorId = getAuthorId(post.authorId);
              const authorProfile = getAuthorProfile(post.authorId);
              const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
              const commentsCount = Number(post.commentsCount || 0);

              return (
                <article key={post._id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                  <div className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                          {authorProfile ? (
                            <img src={authorProfile} alt={authorLabel} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-700">
                              {authorLabel.replace("@", "").slice(0, 1).toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{authorLabel}</p>
                          <p className="text-xs text-slate-500">
                            {post.createdAt ? new Date(post.createdAt).toLocaleString() : "-"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="rounded border border-red-500 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="whitespace-pre-wrap text-sm text-slate-800">{post.caption || "No caption"}</p>

                    {authorId && (
                      <a
                        href={`/admin/users/${authorId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded border px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Open Author
                      </a>
                    )}
                  </div>

                  {post.mediaUrl && post.mediaType === "image" && (
                    <img
                      src={buildPostMediaUrl(post.mediaUrl, post.mediaType)}
                      alt="Post media"
                      className="max-h-[30rem] w-full object-cover"
                    />
                  )}

                  {post.mediaUrl && post.mediaType === "video" && (
                    <video src={buildPostMediaUrl(post.mediaUrl, post.mediaType)} controls className="w-full bg-black" />
                  )}

                  <div className="border-t px-4 py-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>{likesCount} likes</span>
                      <span>{commentsCount} comments</span>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-slate-400">Post ID: {post._id}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          disabled={pagination.page <= 1}
          onClick={() => void loadPosts(pagination.page - 1)}
          className="rounded border px-3 py-1 text-sm disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-slate-600">
          Page {pagination.page} of {pagination.totalPages || 1}
        </span>
        <button
          disabled={pagination.page >= (pagination.totalPages || 1)}
          onClick={() => void loadPosts(pagination.page + 1)}
          className="rounded border px-3 py-1 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void onDelete()}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
      />
    </div>
  );
}
