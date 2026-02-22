"use client";

import Link from "next/link";

type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type FriendsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  friends: FriendUser[];
};

const profileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${backendUrl}/uploads/profile/${profileUrl}`;
};

export default function FriendsModal({ isOpen, onClose, friends }: FriendsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
              All Friends ({friends.length})
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              X
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto p-4">
            {friends.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-zinc-400">No friends found.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {friends.map((friend) => {
                  const friendName =
                    `${friend.firstName || ""} ${friend.lastName || ""}`.trim() ||
                    friend.username ||
                    "User";
                  const image = profileImageUrl(friend.profileUrl);

                  return (
                    <Link
                      key={friend._id || friend.username || friendName}
                      href={friend._id ? `/user/profile/${friend._id}` : "#"}
                      onClick={onClose}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={friendName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700 dark:text-zinc-200">
                              {friendName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            {friendName}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                            @{friend.username || "unknown"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
