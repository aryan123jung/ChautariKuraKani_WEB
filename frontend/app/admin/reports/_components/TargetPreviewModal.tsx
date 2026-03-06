"use client";

import { useEffect, useState } from "react";
import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import type { TargetPreview } from "./types";
import InfoItem from "./InfoItem";

type Props = {
  open: boolean;
  loading: boolean;
  preview: TargetPreview | null;
  onClose: () => void;
};

export default function TargetPreviewModal({ open, loading, preview, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Reported Target</h2>
            <p className="text-xs text-slate-500">Fetched from target entity API</p>
          </div>
          <button onClick={onClose} className="rounded border px-2 py-1 text-xs">
            Close
          </button>
        </div>

        {loading && <div className="py-6 text-center text-sm text-slate-500">Loading target...</div>}

        {!loading && (
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            {preview?.kind === "user" && <TargetUserCard data={preview.data} />}
            {preview?.kind === "post" && <TargetPostCard data={preview.data} />}
            {preview?.kind === "community" && <TargetCommunityCard data={preview.data} />}
          </div>
        )}
      </div>
    </div>
  );
}

function TargetUserCard({ data }: { data: Record<string, unknown> }) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  const profileUrl = typeof data.profileUrl === "string" ? data.profileUrl : "";
  const coverUrl = typeof data.coverUrl === "string" ? data.coverUrl : "";
  const fullProfileUrl = profileUrl ? `${backendUrl}/uploads/profile/${profileUrl}` : "";
  const fullCoverUrl = coverUrl ? `${backendUrl}/uploads/cover/${coverUrl}` : "";
  const firstName = String(data.firstName || "");
  const lastName = String(data.lastName || "");
  const username = String(data.username || "");
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  const userId = String(data._id || data.id || "");

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div className="relative h-36 w-full bg-slate-200">
        {fullCoverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fullCoverUrl} alt="User cover" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-slate-200 to-slate-300" />
        )}
      </div>

      <div className="relative px-4 pb-4 pt-0">
        <div className="-mt-10 mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-slate-300">
          {fullProfileUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fullProfileUrl} alt="User profile" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-700">
              {initials}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">
            {[firstName, lastName].filter(Boolean).join(" ") || "User"}
          </h3>
          <p className="text-sm text-slate-500">@{username || "-"}</p>
          <p className="text-sm text-slate-600">{String(data.email || "-")}</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <InfoItem label="Role" value={String(data.role || "-")} />
          <InfoItem label="Status" value={String(data.accountStatus || "-")} />
        </div>

        {!!userId && (
          <a
            href={`/admin/users/${userId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Open Full Admin Profile
          </a>
        )}
      </div>
    </div>
  );
}

function TargetPostCard({ data }: { data: Record<string, unknown> }) {
  const nestedPost =
    (data.post as Record<string, unknown> | undefined) ||
    (data.targetPost as Record<string, unknown> | undefined) ||
    (data.postData as Record<string, unknown> | undefined);
  const postData = nestedPost || data;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  const mediaUrl = typeof postData.mediaUrl === "string" ? postData.mediaUrl : "";
  const mediaType = typeof postData.mediaType === "string" ? postData.mediaType : "";
  const fullMediaUrl = mediaUrl
    ? `${backendUrl}/uploads/posts/${mediaType === "video" ? "videos" : "images"}/${mediaUrl}`
    : "";

  const caption =
    (typeof postData.caption === "string" && postData.caption) ||
    (typeof postData.text === "string" && postData.text) ||
    (typeof postData.content === "string" && postData.content) ||
    (typeof postData.description === "string" && postData.description) ||
    "";

  const authorValue =
    (postData as { authorId?: unknown; userId?: unknown }).authorId ||
    (postData as { userId?: unknown }).userId;
  const authorId =
    typeof authorValue === "string"
      ? authorValue
      : (authorValue as { _id?: string } | undefined)?._id || "-";
  const authorUsername =
    typeof authorValue === "string"
      ? ""
      : (authorValue as { username?: string } | undefined)?.username || "";
  const [resolvedAuthorUsername, setResolvedAuthorUsername] = useState(authorUsername);
  const authorName =
    typeof authorValue === "string"
      ? "User"
      : `${(authorValue as { firstName?: string } | undefined)?.firstName || ""} ${
          (authorValue as { lastName?: string } | undefined)?.lastName || ""
        }`.trim() || "User";

  const authorProfile =
    typeof authorValue === "string"
      ? ""
      : ((authorValue as { profileUrl?: string; profileImage?: string } | undefined)?.profileUrl ||
          (authorValue as { profileUrl?: string; profileImage?: string } | undefined)?.profileImage ||
          "");
  const fullAuthorProfile = authorProfile ? `${backendUrl}/uploads/profile/${authorProfile}` : "";
  const likesCount = Array.isArray(postData.likes) ? postData.likes.length : 0;
  const commentsCount = Number(postData.commentsCount || 0);

  useEffect(() => {
    let cancelled = false;

    const resolveUsername = async () => {
      if (authorUsername || authorId === "-") {
        setResolvedAuthorUsername(authorUsername);
        return;
      }

      const response = await handleGetOneUser(authorId);
      if (!cancelled && response.success && response.data) {
        const username = String((response.data as { username?: string }).username || "");
        setResolvedAuthorUsername(username);
      }
    };

    void resolveUsername();
    return () => {
      cancelled = true;
    };
  }, [authorId, authorUsername]);

  return (
    <article className="overflow-hidden rounded-2xl border bg-white">
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
            {fullAuthorProfile ? (
              <img src={fullAuthorProfile} alt={authorName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-700">
                {authorName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{authorName}</p>
            <p className="text-xs text-slate-500">
              {postData.createdAt ? new Date(String(postData.createdAt)).toLocaleString() : ""}
            </p>
          </div>
        </div>

        <div className="mb-2 rounded border bg-slate-50 p-2">
          <p className="mb-1 text-xs font-medium uppercase text-slate-500">Caption</p>
          <p className="whitespace-pre-wrap text-sm text-slate-800">{caption || "No caption provided"}</p>
        </div>

        <InfoItem
          label="Author Username"
          value={resolvedAuthorUsername ? `@${resolvedAuthorUsername}` : "-"}
        />

        {authorId !== "-" && (
          <a
            href={`/admin/users/${authorId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Open Author Profile
          </a>
        )}
      </div>

      {fullMediaUrl && mediaType === "image" && (
        <img src={fullMediaUrl} alt="Reported post" className="max-h-[32rem] w-full object-cover" />
      )}
      {fullMediaUrl && mediaType === "video" && (
        <video src={fullMediaUrl} controls className="w-full bg-black" />
      )}

      <div className="border-t px-4 py-2 text-xs text-slate-500">
        <div className="mb-1 flex items-center justify-between">
          <span>{likesCount} likes</span>
          <span>{commentsCount} comments</span>
        </div>
        <p className="text-[11px] uppercase text-slate-400">{mediaType || "no media"}</p>
      </div>
    </article>
  );
}

function TargetCommunityCard({ data }: { data: Record<string, unknown> }) {
  const communityId = String(data._id || "");
  const creatorValue = (data as { creatorId?: unknown }).creatorId;
  const creatorId =
    typeof creatorValue === "string"
      ? creatorValue
      : (creatorValue as { _id?: string } | undefined)?._id || "-";

  return (
    <div className="space-y-2 text-sm">
      <InfoItem label="Community ID" value={String(data._id || "-")} />
      <InfoItem label="Name" value={String(data.name || "-")} />
      <InfoItem label="Slug" value={String(data.slug || "-")} />
      <InfoItem label="Creator ID" value={creatorId} />
      <div className="rounded border bg-slate-50 p-2">
        <p className="text-xs font-medium uppercase text-slate-500">Description</p>
        <p className="text-sm text-slate-900">{String(data.description || "-")}</p>
      </div>
      {!!communityId && (
        <a
          href={`/admin/chautari/${communityId}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Open Chautari In Admin
        </a>
      )}
    </div>
  );
}
