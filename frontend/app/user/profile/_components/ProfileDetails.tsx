"use client";

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
}: {
  user: ProfileUser;
  onEdit?: () => void;
  onAddPost?: () => void;
  canManageProfile?: boolean;
}) {
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
    </div>
  );
}
