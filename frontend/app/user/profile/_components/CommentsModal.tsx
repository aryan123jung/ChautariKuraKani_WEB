"use client";

import Image from "next/image";
import type { PostItem } from "../schema";

type CommentType = NonNullable<PostItem["comments"]>[number];

export default function CommentsModal({
  isOpen,
  onClose,
  comments,
  commentInput,
  onCommentInputChange,
  onSubmitComment,
  onDeleteComment,
  canDeleteComment,
  getCommentAuthorName,
  getCommentAvatarUrl,
  isBusy,
}: {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentType[];
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  onSubmitComment: () => void;
  onDeleteComment: (commentId: string) => void;
  canDeleteComment: (comment: CommentType) => boolean;
  getCommentAuthorName: (comment: CommentType) => string;
  getCommentAvatarUrl: (comment: CommentType) => string | null;
  isBusy: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Comments</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200"
          >
            X
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-zinc-400">No comments yet.</p>
          )}

          {comments.map((comment, index) => {
            const commentId = comment._id?.toString();
            const avatarUrl = getCommentAvatarUrl(comment);
            const authorName = getCommentAuthorName(comment);

            return (
              <div
                key={commentId || `comment-${index}`}
                className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={authorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-600 dark:text-zinc-200">
                        {authorName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{authorName}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>

                    <p className="mt-1 text-sm text-slate-700 dark:text-zinc-200">{comment.text}</p>

                    {commentId && canDeleteComment(comment) && (
                      <button
                        onClick={() => onDeleteComment(commentId)}
                        className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-200 dark:border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <input
              value={commentInput}
              onChange={(e) => onCommentInputChange(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-slate-900 dark:text-zinc-100 focus:border-slate-400 dark:focus:border-zinc-600 focus:outline-none"
            />
            <button
              onClick={onSubmitComment}
              disabled={isBusy}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
