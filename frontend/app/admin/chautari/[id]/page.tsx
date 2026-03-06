import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetChautariById, handleGetChautariPosts } from "@/lib/actions/chautari-action";

type PageProps = {
  params: Promise<{ id: string }>;
};

type CommunityUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type Community = {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  profileUrl?: string;
  creatorId?: string | CommunityUser;
  members?: Array<string | CommunityUser>;
  createdAt?: string;
};

type CommunityPost = {
  _id?: string;
  caption?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | string;
  createdAt?: string;
  likes?: unknown[];
  commentsCount?: number;
  authorId?: string | CommunityUser;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";

const getCommunityProfileUrl = (profileUrl?: string) =>
  profileUrl ? `${BACKEND_URL}/uploads/chautari/profile/${profileUrl}` : "";

const getPostMediaUrl = (mediaUrl?: string, mediaType?: string) => {
  if (!mediaUrl) return "";
  return `${BACKEND_URL}/uploads/posts/${mediaType === "video" ? "videos" : "images"}/${mediaUrl}`;
};

const getUserLabel = (user?: string | CommunityUser) => {
  if (!user) return "-";
  if (typeof user === "string") return user;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return user.username ? `@${user.username}` : fullName || user._id || "-";
};

const getUserProfileUrl = (user?: string | CommunityUser) => {
  if (!user || typeof user === "string" || !user.profileUrl) return "";
  return `${BACKEND_URL}/uploads/profile/${user.profileUrl}`;
};

export default async function AdminChautariDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [communityResponse, postsResponse] = await Promise.all([
    handleGetChautariById(id),
    handleGetChautariPosts(id, 1, 50),
  ]);

  if (!communityResponse.success || !communityResponse.data) {
    notFound();
  }

  const community = communityResponse.data as Community;
  const posts = (postsResponse.data || []) as CommunityPost[];
  const creator = community.creatorId;
  const creatorId = typeof creator === "string" ? creator : creator?._id || "";
  const profileImage = getCommunityProfileUrl(community.profileUrl);
  const memberCount = Array.isArray(community.members) ? community.members.length : 0;

  return (
    <div className="space-y-5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Chautari Detail</h1>
        <Link href="/admin/reports" className="rounded border px-3 py-1.5 text-sm hover:bg-slate-50">
          Back To Reports
        </Link>
      </div>

      <section className="rounded-lg border bg-white p-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200">
            {profileImage ? (
              <img src={profileImage} alt={community.name || "Chautari"} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700">
                {(community.name || "C").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-slate-900">{community.name || "-"}</h2>
            <p className="text-sm text-slate-500">c/{community.slug || "-"}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {community.description || "No description"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
          <p>
            <span className="font-medium">Community ID:</span> {community._id || "-"}
          </p>
          <p>
            <span className="font-medium">Members:</span> {memberCount}
          </p>
          <p>
            <span className="font-medium">Creator:</span> {getUserLabel(creator)}
          </p>
          <p>
            <span className="font-medium">Created:</span>{" "}
            {community.createdAt ? new Date(community.createdAt).toLocaleString() : "-"}
          </p>
        </div>

        {!!creatorId && (
          <a
            href={`/admin/users/${creatorId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Open Creator In Admin
          </a>
        )}
      </section>

      <section className="rounded-lg border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Recent Posts</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{posts.length} items</span>
        </div>

        {posts.length === 0 && <p className="text-sm text-slate-500">No posts in this chautari.</p>}

        {posts.length > 0 && (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            {posts.map((post, index) => {
              const media = getPostMediaUrl(post.mediaUrl, post.mediaType);
              const authorProfile = getUserProfileUrl(post.authorId);
              const authorName = getUserLabel(post.authorId);
              const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;
              const commentCount = Number(post.commentsCount || 0);

              return (
                <article key={post._id || `${id}-${index}`} className="overflow-hidden rounded-xl border">
                  <div className="p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                        {authorProfile ? (
                          <img src={authorProfile} alt={authorName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-slate-700">
                            {authorName.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{authorName}</p>
                        <p className="text-xs text-slate-500">
                          {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>

                    <p className="whitespace-pre-wrap text-sm text-slate-800">{post.caption || "No caption"}</p>
                  </div>

                  {media && post.mediaType === "image" && (
                    <img src={media} alt="Chautari post" className="max-h-[28rem] w-full object-cover" />
                  )}

                  {media && post.mediaType === "video" && <video src={media} controls className="w-full bg-black" />}

                  <div className="border-t px-3 py-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>{likeCount} likes</span>
                      <span>{commentCount} comments</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
