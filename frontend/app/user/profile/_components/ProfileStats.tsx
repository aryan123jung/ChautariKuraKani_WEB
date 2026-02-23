import type { PostItem } from "../schema";

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-zinc-100">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{helper}</p>}
    </div>
  );
}

export default function ProfileStats({
  user,
  posts,
  friendsCount,
}: {
  user: {
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
    id?: string;
  };
  posts: PostItem[];
  friendsCount?: number | null;
}) {
  const userId = user.id || user._id || "";
  const totalPosts = posts.filter((post) => {
    const authorId =
      typeof post.authorId === "string" ? post.authorId : post.authorId?._id || "";
    return authorId === userId;
  }).length;

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard label="Posts" value={`${totalPosts}`} helper="Shared on your timeline" />
      <StatCard
        label="Friends"
        value={friendsCount == null ? "--" : `${friendsCount}`}
        helper={friendsCount == null ? "Not available yet" : "Connected friends"}
      />
      <StatCard label="Chautari" value="--" helper="Coming soon" />
      <StatCard
        label="Joined"
        value={user.createdAt ? new Date(user.createdAt).toDateString() : "-"}
      />
      <StatCard
        label="Last Update"
        value={user.updatedAt ? new Date(user.updatedAt).toDateString() : "-"}
      />
      <StatCard
        label="Account"
        value={user.role || "User"}
      />
    </div>
  );
}
