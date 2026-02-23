"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDetails from "./ProfileDetails";
import EditProfileForm from "./EditProfileForm";
import AddPostModal from "./AddPostModal";
import ProfilePostsWidget from "./ProfilePostsWidget";
import type { PostItem } from "../schema";
import {
  handleAcceptFriendRequest,
  handleCancelFriendRequest,
  handleGetFriendStatus,
  handleRejectFriendRequest,
  handleSendFriendRequest,
  handleUnfriendUser,
} from "@/lib/actions/friend-action";
import { toast } from "react-toastify";

type FriendStatus =
  | "SELF"
  | "NONE"
  | "FRIEND"
  | "PENDING_OUTGOING"
  | "PENDING_INCOMING";

type ProfileUser = {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  profileUrl?: string;
  coverUrl?: string;
  initialPosts?: PostItem[];
};

export default function ProfileClient({
  user,
  currentUserId,
  viewerProfileUrl,
  friendsCount = 0,
}: {
  user: ProfileUser;
  currentUserId?: string;
  viewerProfileUrl?: string;
  friendsCount?: number;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>(user.initialPosts || []);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("NONE");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [isFriendActionBusy, setIsFriendActionBusy] = useState(false);

  const profileUserId = user.id || user._id || "";
  const viewerUserId = currentUserId || "";
  const canManageProfile = !!viewerUserId && viewerUserId === profileUserId;
  const postsCount = posts.filter((post) => {
    const authorId = typeof post.authorId === "string" ? post.authorId : post.authorId?._id || "";
    return authorId === profileUserId;
  }).length;

  const refreshFriendStatus = useCallback(async () => {
    if (!viewerUserId || !profileUserId || viewerUserId === profileUserId) {
      setFriendStatus(viewerUserId === profileUserId ? "SELF" : "NONE");
      setActiveRequestId(null);
      return;
    }

    const response = await handleGetFriendStatus(profileUserId);
    if (response.success) {
      setFriendStatus((response.data?.status as FriendStatus) || "NONE");
      setActiveRequestId(response.data?.requestId || null);
      return;
    }

    setFriendStatus("NONE");
    setActiveRequestId(null);
  }, [viewerUserId, profileUserId]);

  useEffect(() => {
    void refreshFriendStatus();
  }, [refreshFriendStatus]);

  const withFriendAction = async (action: () => Promise<{ success: boolean; message: string }>) => {
    if (isFriendActionBusy) return;
    setIsFriendActionBusy(true);
    try {
      const result = await action();
      if (!result.success) {
        throw new Error(result.message || "Action failed");
      }
      toast.success(result.message || "Updated");
      await refreshFriendStatus();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setIsFriendActionBusy(false);
    }
  };

  return (
    <>
      {!isEditing ? (
        <ProfileDetails
          user={user}
          postsCount={postsCount}
          friendsCount={friendsCount}
          onEdit={canManageProfile ? () => setIsEditing(true) : undefined}
          onAddPost={canManageProfile ? () => setIsAddPostOpen(true) : undefined}
          canManageProfile={canManageProfile}
          friendStatus={friendStatus}
          isFriendActionBusy={isFriendActionBusy}
          onSendRequest={() =>
            void withFriendAction(() => handleSendFriendRequest(profileUserId))
          }
          onCancelRequest={() =>
            void withFriendAction(() => handleCancelFriendRequest(profileUserId))
          }
          onAcceptRequest={() =>
            void withFriendAction(async () => {
              if (!activeRequestId) {
                return { success: false, message: "Request not found" };
              }
              const response = await handleAcceptFriendRequest(activeRequestId);
              return { success: response.success, message: response.message };
            })
          }
          onRejectRequest={() =>
            void withFriendAction(async () => {
              if (!activeRequestId) {
                return { success: false, message: "Request not found" };
              }
              const response = await handleRejectFriendRequest(activeRequestId);
              return { success: response.success, message: response.message };
            })
          }
          onUnfriend={() =>
            void withFriendAction(() => handleUnfriendUser(profileUserId))
          }
          onMessage={() => {
            if (!profileUserId) return;
            router.push(`/user/message?userId=${profileUserId}`);
          }}
        />
      ) : (
        <EditProfileForm user={user} onCancel={() => setIsEditing(false)} />
      )}

      {canManageProfile && (
        <AddPostModal
          isOpen={isAddPostOpen}
          onClose={() => setIsAddPostOpen(false)}
          onPostCreated={(post) => setPosts((prev) => [post, ...prev])}
        />
      )}

      {profileUserId && (
        <ProfilePostsWidget
          userId={profileUserId}
          viewerUserId={viewerUserId}
          canManagePosts={canManageProfile}
          currentUserProfileUrl={viewerProfileUrl || user.profileUrl}
          profileOwnerProfileUrl={user.profileUrl}
          posts={posts}
          onPostsChange={setPosts}
        />
      )}
    </>
  );
}
