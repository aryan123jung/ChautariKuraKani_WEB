import type { PostItem } from "../schema";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function ProfileStats({
  user,
  posts,
}: {
  user: {
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
    id?: string;
  };
  posts: PostItem[];
}) {
  const userId = user.id || user._id || "";
  const totalPosts = posts.filter((post) => {
    const authorId =
      typeof post.authorId === "string" ? post.authorId : post.authorId?._id || "";
    return authorId === userId;
  }).length;

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Role" value={user.role || "User"} />
      <StatCard label="Posts" value={`${totalPosts}`} />
      <StatCard
        label="Joined"
        value={user.createdAt ? new Date(user.createdAt).toDateString() : "-"}
      />
      <StatCard
        label="Updated"
        value={user.updatedAt ? new Date(user.updatedAt).toDateString() : "-"}
      />
    </div>
  );
}
