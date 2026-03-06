import { Loader2, MessageCircle, MoreVertical, Pencil, ThumbsUp, Trash2, Users } from "lucide-react";
import type { CommunityItem, CommunityPost } from "../schema";
import { buildCommunityProfileImageUrl, buildPostMediaUrl, buildProfileImageUrl, getUserName } from "./chautari-utils";

type Props = {
  selectedCommunity: CommunityItem | null;
  loadingCommunity: boolean;
  memberCount: number;
  posts: CommunityPost[];
  isJoined: boolean;
  isCreator: boolean;
  joiningOrLeaving: boolean;
  deletingCommunity: boolean;
  updatingCommunity: boolean;
  isCommunityMenuOpen: boolean;
  busyPostId: string | null;
  onToggleCommunityMenu: () => void;
  onOpenReportCommunity: () => void;
  onOpenEditCommunity: () => void;
  onOpenCreatePost: () => void;
  onOpenDeleteCommunity: () => void;
  onJoinOrLeave: () => void;
  canEditPost: (post: CommunityPost) => boolean;
  canDeletePost: (post: CommunityPost) => boolean;
  onOpenEditPost: (post: CommunityPost) => void;
  onOpenDeletePost: (postId: string) => void;
  hasLiked: (post: CommunityPost) => boolean;
  onLikePost: (postId: string) => void;
  onOpenComments: (postId: string) => void;
};

export default function CommunityFeedPanel({
  selectedCommunity,
  loadingCommunity,
  memberCount,
  posts,
  isJoined,
  isCreator,
  joiningOrLeaving,
  deletingCommunity,
  updatingCommunity,
  isCommunityMenuOpen,
  busyPostId,
  onToggleCommunityMenu,
  onOpenReportCommunity,
  onOpenEditCommunity,
  onOpenCreatePost,
  onOpenDeleteCommunity,
  onJoinOrLeave,
  canEditPost,
  canDeletePost,
  onOpenEditPost,
  onOpenDeletePost,
  hasLiked,
  onLikePost,
  onOpenComments,
}: Props) {
  return (
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
                      const selectedCommunityAvatar = buildCommunityProfileImageUrl(selectedCommunity.profileUrl);
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
                              {(selectedCommunity.name || selectedCommunity.slug || "C").slice(0, 1).toUpperCase()}
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
                      onClick={onOpenCreatePost}
                      disabled={!isJoined}
                      className="rounded-xl bg-[#76C05D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#67a94f] disabled:opacity-60"
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
                        onClick={onOpenDeleteCommunity}
                        disabled={deletingCommunity}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
                      >
                        <Trash2 size={14} />
                        {deletingCommunity ? "Deleting..." : "Delete"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onJoinOrLeave}
                      disabled={joiningOrLeaving}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        isJoined
                          ? "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                          : "bg-slate-900 text-white hover:bg-slate-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                      } disabled:opacity-60`}
                    >
                      {joiningOrLeaving ? "Please wait..." : isJoined ? "Leave" : "Join"}
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={onToggleCommunityMenu}
                        className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        aria-label="More options"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {isCommunityMenuOpen && (
                        <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                          {!isCreator && (
                            <button
                              type="button"
                              onClick={onOpenReportCommunity}
                              className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                            >
                              Report Chautari
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Users size={14} />
                    {memberCount} members
                  </span>
                  <span>
                    Created {selectedCommunity.createdAt ? new Date(selectedCommunity.createdAt).toLocaleDateString() : "-"}
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
                              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{authorName}</p>
                              <p className="text-xs text-slate-500 dark:text-zinc-400">
                                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {canEditPost(post) && (
                              <button
                                type="button"
                                onClick={() => onOpenEditPost(post)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                              >
                                <Pencil size={12} />
                                Edit
                              </button>
                            )}
                            {canDeletePost(post) && (
                              <button
                                type="button"
                                onClick={() => onOpenDeletePost(post._id)}
                                className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>

                        {post.caption && <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-zinc-200">{post.caption}</p>}
                      </div>

                      {mediaUrl && post.mediaType === "image" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mediaUrl} alt="Community post media" className="max-h-[32rem] w-full object-cover" />
                      )}

                      {mediaUrl && post.mediaType === "video" && <video src={mediaUrl} controls className="w-full bg-black" />}

                      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                        <div className="mb-2 flex items-center justify-between">
                          <span>{post.likes?.length || 0} likes</span>
                          <span>{post.commentsCount || post.comments?.length || 0} comments</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onLikePost(post._id)}
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
  );
}

