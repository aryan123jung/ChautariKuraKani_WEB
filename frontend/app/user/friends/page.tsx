"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  handleAcceptFriendRequest,
  handleGetIncomingFriendRequests,
  handleGetOutgoingFriendRequests,
  handleRejectFriendRequest,
  handleCancelFriendRequest,
} from "@/lib/actions/friend-action";
import { toast } from "react-toastify";

type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type FriendRequestItem = {
  _id: string;
  fromUserId: string | FriendUser;
  toUserId: string | FriendUser;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt?: string;
};

const getUserFromField = (value: string | FriendUser) => {
  if (!value || typeof value === "string") return null;
  return value;
};

const profileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${backendUrl}/uploads/profile/${profileUrl}`;
};

export default function FriendsPage() {
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestItem[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        handleGetIncomingFriendRequests(1, 20),
        handleGetOutgoingFriendRequests(1, 20),
      ]);

      if (incomingRes.success) {
        setIncomingRequests((incomingRes.data || []) as FriendRequestItem[]);
      }
      if (outgoingRes.success) {
        setOutgoingRequests((outgoingRes.data || []) as FriendRequestItem[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const acceptRequest = async (requestId: string) => {
    if (activeRequestId) return;

    setActiveRequestId(requestId);
    try {
      const response = await handleAcceptFriendRequest(requestId);
      if (!response.success) {
        throw new Error(response.message || "Failed to accept request");
      }
      toast.success(response.message || "Friend request accepted");
      setIncomingRequests((prev) => prev.filter((item) => item._id !== requestId));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to accept request");
    } finally {
      setActiveRequestId(null);
    }
  };

  const rejectRequest = async (requestId: string) => {
    if (activeRequestId) return;

    setActiveRequestId(requestId);
    try {
      const response = await handleRejectFriendRequest(requestId);
      if (!response.success) {
        throw new Error(response.message || "Failed to reject request");
      }
      toast.success(response.message || "Friend request rejected");
      setIncomingRequests((prev) => prev.filter((item) => item._id !== requestId));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to reject request");
    } finally {
      setActiveRequestId(null);
    }
  };

  const cancelRequest = async (request: FriendRequestItem) => {
    if (activeRequestId) return;
    const toUser = getUserFromField(request.toUserId);
    if (!toUser?._id) return;

    setActiveRequestId(request._id);
    try {
      const response = await handleCancelFriendRequest(toUser._id);
      if (!response.success) {
        throw new Error(response.message || "Failed to cancel request");
      }
      toast.success(response.message || "Friend request cancelled");
      setOutgoingRequests((prev) => prev.filter((item) => item._id !== request._id));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel request");
    } finally {
      setActiveRequestId(null);
    }
  };

  const renderRequestCard = (
    request: FriendRequestItem,
    user: FriendUser | null,
    mode: "incoming" | "outgoing"
  ) => {
    const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "User";
    const image = profileImageUrl(user?.profileUrl);
    const isBusy = activeRequestId === request._id;

    return (
      <article
        key={request._id}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={userName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  {userName.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <Link
                href={user?._id ? `/user/profile/${user._id}` : "#"}
                className="text-sm font-semibold text-slate-900 hover:underline dark:text-zinc-100"
              >
                {userName}
              </Link>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                @{user?.username || "unknown"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                {mode === "incoming" ? "sent you a friend request" : "request pending"}
              </p>
            </div>
          </div>

          {mode === "incoming" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void acceptRequest(request._id);
                }}
                disabled={isBusy}
                className="rounded-lg bg-[#76C05D] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#67a94f] disabled:opacity-60"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void rejectRequest(request._id);
                }}
                disabled={isBusy}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Reject
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void cancelRequest(request);
              }}
              disabled={isBusy}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-zinc-100">
          Friend Requests
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Manage incoming and outgoing friend requests.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Loading friend requests...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Incoming</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                {incomingRequests.length}
              </span>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
                No incoming requests.
              </div>
            ) : (
              incomingRequests.map((request) =>
                renderRequestCard(request, getUserFromField(request.fromUserId), "incoming")
              )
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Outgoing</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                {outgoingRequests.length}
              </span>
            </div>

            {outgoingRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
                No outgoing requests.
              </div>
            ) : (
              outgoingRequests.map((request) =>
                renderRequestCard(request, getUserFromField(request.toUserId), "outgoing")
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}
