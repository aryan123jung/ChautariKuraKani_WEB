"use client";

import type { CommunityItem } from "../schema";

type Props = {
  myCommunities: CommunityItem[];
  currentUserId: string;
  selectedCommunityId: string | null;
  onSelectCommunity: (communityId: string) => void;
  onOpenCreate: () => void;
};

const getEntityId = (entity?: string | { _id?: string } | null) => {
  if (!entity) return "";
  if (typeof entity === "string") return entity;
  return entity._id || "";
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";

const buildCommunityProfileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  return `${BACKEND_URL}/uploads/chautari/profile/${profileUrl}`;
};

const getCommunityDisplayName = (community: CommunityItem) => {
  if (community.name) {
    return community.name.toLowerCase().startsWith("c/")
      ? community.name
      : `c/${community.name}`;
  }
  if (community.slug) return `c/${community.slug}`;
  return "c/community";
};

export default function MyChautariSidebar({
  myCommunities,
  currentUserId,
  selectedCommunityId,
  onSelectCommunity,
  onOpenCreate,
}: Props) {
  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">My Chautari</h2>
        <button
          type="button"
          onClick={onOpenCreate}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Create
        </button>
      </div>
      <p className="mb-3 text-xs text-slate-500 dark:text-zinc-400">
        Communities you created or joined.
      </p>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-feed pr-1">
        {myCommunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
            No joined/created Chautari yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {myCommunities.map((community) => {
              const communityName = getCommunityDisplayName(community);
              const isOwned = getEntityId(community.creatorId) === currentUserId;
              const communityAvatar = buildCommunityProfileImageUrl(community.profileUrl);
              return (
                <li key={community._id}>
                  <button
                    type="button"
                    onClick={() => onSelectCommunity(community._id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selectedCommunityId === community._id
                        ? "border-slate-900 bg-slate-100 dark:border-zinc-100 dark:bg-zinc-800"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                          {communityAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={communityAvatar}
                              alt={communityName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-700 dark:text-zinc-200">
                              {(community.slug || community.name || "c").slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                          {communityName}
                        </p>
                      </div>
                      {isOwned ? (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Created
                        </span>
                      ) : null}
                    </div>
                    {/* <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-zinc-400">
                      {community.description || "No description"}
                    </p> */}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
