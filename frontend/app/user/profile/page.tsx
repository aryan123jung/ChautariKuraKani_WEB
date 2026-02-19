import { getUserData } from "@/lib/cookie";
import ProfileCover from "./_components/ProfileCover";
import ProfileAvatar from "./_components/ProfileAvatar";
import ProfileStats from "./_components/ProfileStats";
import ProfileClient from "./_components/ProfileClient";
import { handleGetAllPosts } from "@/lib/actions/post-action";
import type { PostItem } from "./schema";

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    return <div>User not found</div>;
  }

  const postsResponse = await handleGetAllPosts(1, 100);
  const initialPosts: PostItem[] = postsResponse.success
    ? ((postsResponse.data as PostItem[]) || [])
    : [];

  return (
    <div className="mx-auto max-w-6xl px-3 pb-10 pt-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <ProfileCover coverUrl={user.coverUrl} />

        <div className="relative px-4 pb-6 sm:px-8">
          <ProfileAvatar profileUrl={user.profileUrl} />
          <ProfileClient user={{ ...user, initialPosts }} />
          <ProfileStats user={user} posts={initialPosts} />
        </div>
      </div>
    </div>
  );
}
