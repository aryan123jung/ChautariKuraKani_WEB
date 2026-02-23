import { getUserData } from "@/lib/cookie";
import ProfileCover from "./_components/ProfileCover";
import ProfileAvatar from "./_components/ProfileAvatar";
import ProfileClient from "./_components/ProfileClient";
import { handleGetAllPosts } from "@/lib/actions/post-action";
import { handleGetFriendCount } from "@/lib/actions/friend-action";
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
  const userId = user.id || user._id || "";
  const friendCountResponse = userId
    ? await handleGetFriendCount(userId)
    : { success: false, data: { count: 0 } };
  const friendsCount = friendCountResponse.success
    ? friendCountResponse.data.count
    : null;

  return (
    <div className="mx-auto max-w-6xl px-3 pb-12 pt-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-black/40">
        <ProfileCover coverUrl={user.coverUrl} />

        <div className="relative px-4 pb-7 sm:px-8">
          <ProfileAvatar profileUrl={user.profileUrl} />
          <ProfileClient
            user={{ ...user, initialPosts }}
            currentUserId={user.id || user._id}
            viewerProfileUrl={user.profileUrl}
            friendsCount={friendsCount || 0}
          />
        </div>
      </div>
    </div>
  );
}
