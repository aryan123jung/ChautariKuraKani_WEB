import { handleFindUserById, handleGetUserById } from "@/lib/actions/auth-action";
import { handleGetAllPosts } from "@/lib/actions/post-action";
import { getUserData } from "@/lib/cookie";
import type { PostItem } from "../schema";
import ProfileAvatar from "../_components/ProfileAvatar";
import ProfileClient from "../_components/ProfileClient";
import ProfileCover from "../_components/ProfileCover";
import { handleGetFriendCount } from "@/lib/actions/friend-action";

export default async function PublicProfilePage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id?.trim();

  if (!id) {
    return <div>User not found</div>;
  }
  const currentUser = await getUserData();

  let userResponse = await handleGetUserById(id);
  if (!userResponse.success || !userResponse.data) {
    userResponse = await handleFindUserById(id);
  }

  const postsResponse = await handleGetAllPosts(1, 100);
  const initialPosts: PostItem[] = postsResponse.success
    ? ((postsResponse.data as PostItem[]) || [])
    : [];

  if (!userResponse.success || !userResponse.data) {
    const matchedPost = initialPosts.find((post) => {
      if (!post.authorId || typeof post.authorId === "string") return false;
      return post.authorId._id === id;
    });

    if (matchedPost?.authorId && typeof matchedPost.authorId !== "string") {
      userResponse = {
        success: true,
        message: "User fetched from posts",
        data: {
          _id: matchedPost.authorId._id,
          firstName: matchedPost.authorId.firstName,
          lastName: matchedPost.authorId.lastName,
          email: matchedPost.authorId.email,
          profileUrl:
            matchedPost.authorId.profileUrl || matchedPost.authorId.profileImage,
        },
      };
    }
  }

  if (!userResponse.success || !userResponse.data) {
    return <div>User not found</div>;
  }

  const fetchedUser = userResponse.data;
  const profileUser = {
    ...fetchedUser,
    firstName: fetchedUser.firstName || "",
    lastName: fetchedUser.lastName || "",
    username: fetchedUser.username || "",
    email: fetchedUser.email || "",
    id: fetchedUser.id || fetchedUser._id,
    initialPosts,
  };
  const currentUserId = currentUser?.id || currentUser?._id || "";
  const profileUserId = profileUser.id || profileUser._id || "";
  const friendCountResponse = profileUserId
    ? await handleGetFriendCount(profileUserId)
    : { success: false, data: { count: 0 } };
  const friendsCount = friendCountResponse.success
    ? friendCountResponse.data.count
    : null;

  return (
    <div className="mx-auto max-w-6xl px-3 pb-12 pt-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-black/40">
        <ProfileCover coverUrl={profileUser.coverUrl} />

        <div className="relative px-4 pb-7 sm:px-8">
          <ProfileAvatar profileUrl={profileUser.profileUrl} />
          <ProfileClient
            user={profileUser}
            currentUserId={currentUserId}
            viewerProfileUrl={currentUser?.profileUrl}
            friendsCount={friendsCount || 0}
          />
        </div>
      </div>
    </div>
  );
}
