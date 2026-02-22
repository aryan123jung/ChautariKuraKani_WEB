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
  email: string;
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
            className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
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
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          Cancel Request
        </button>
      );
    }

    if (friendStatus === "FRIEND") {
      return (
        <button
          onClick={onUnfriend}
          disabled={isFriendActionBusy}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          Friends
        </button>
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
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm font-medium text-slate-500">@{user.username}</p>
        <p className="text-sm text-slate-600">{user.email}</p>
      </div>

      {canManageProfile && (
        <div className="flex gap-2">
          <button
            onClick={onAddPost}
            className="rounded-xl bg-[#76C05D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add Post
          </button>

          <button
            onClick={onEdit}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Edit Profile
          </button>
        </div>
      )}

      {!canManageProfile && (
        <div className="flex gap-2">
          {renderFriendActions()}
        </div>
      )}
    </div>
  );
}
