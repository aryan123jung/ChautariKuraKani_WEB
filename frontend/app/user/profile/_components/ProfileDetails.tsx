"use client";

type FriendStatus =
  | "SELF"
  | "NONE"
  | "FRIEND"
  | "PENDING_OUTGOING"
  | "PENDING_INCOMING";

type ProfileUser = {
  firstName: string;
  lastName: string;
  username: string;
};

export default function ProfileDetails({
  user,
  onEdit,
  onAddPost,
  canManageProfile = true,
  friendStatus = "NONE",
  isFriendActionBusy = false,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onUnfriend,
  onMessage,
  postsCount = 0,
  friendsCount = 0,
}: {
  user: ProfileUser;
  onEdit?: () => void;
  onAddPost?: () => void;
  canManageProfile?: boolean;
  friendStatus?: FriendStatus;
  isFriendActionBusy?: boolean;
  onSendRequest?: () => void;
  onCancelRequest?: () => void;
  onAcceptRequest?: () => void;
  onRejectRequest?: () => void;
  onUnfriend?: () => void;
  onMessage?: () => void;
  postsCount?: number;
  friendsCount?: number;
}) {
  const renderFriendActions = () => {
    if (friendStatus === "PENDING_INCOMING") {
      return (
        <div className="flex gap-2">
          <button
            onClick={onAcceptRequest}
            disabled={isFriendActionBusy}
            className="rounded-xl bg-[#76C05D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#67a94f] disabled:opacity-60"
          >
            Accept
          </button>
          <button
            onClick={onRejectRequest}
            disabled={isFriendActionBusy}
            className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:bg-zinc-900 dark:hover:bg-red-950/30"
          >
            Reject
          </button>
        </div>
      );
    }

    if (friendStatus === "PENDING_OUTGOING") {
      return (
        <button
          onClick={onCancelRequest}
          disabled={isFriendActionBusy}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Cancel Request
        </button>
      );
    }

    if (friendStatus === "FRIEND") {
      return (
        <div className="flex gap-2">
          <button
            onClick={onMessage}
            className="rounded-xl bg-[#76C05D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#67a94f]"
          >
            Message
          </button>
          <button
            onClick={onUnfriend}
            disabled={isFriendActionBusy}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Friends
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={onSendRequest}
        disabled={isFriendActionBusy}
        className="rounded-xl bg-[#76C05D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#67a94f] disabled:opacity-60"
      >
        Add Friend
      </button>
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-4xl">
            {user.firstName} {user.lastName}
          </h1>
          <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            @{user.username}
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-7 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-3.5 dark:border-zinc-800 dark:bg-gradient-to-r dark:from-zinc-900 dark:to-zinc-950">
          <div className="min-w-20">
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{postsCount}</span>
            <span className="ml-1 text-sm font-medium text-slate-600 dark:text-zinc-400">Posts</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-zinc-700" />
          <div className="min-w-20">
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{friendsCount}</span>
            <span className="ml-1 text-sm font-medium text-slate-600 dark:text-zinc-400">Friends</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-zinc-700" />
          <div className="min-w-20">
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">--</span>
            <span className="ml-1 text-sm font-medium text-slate-600 dark:text-zinc-400">Chautari</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {canManageProfile && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onAddPost}
            className="rounded-xl bg-[#76C05D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#67a94f]"
          >
            Add Post
          </button>

          <button
            onClick={onEdit}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Edit Profile
          </button>
        </div>
      )}

      {!canManageProfile && (
        <div className="flex flex-wrap gap-2">
          {renderFriendActions()}
        </div>
      )}
    </div>
  );
}
