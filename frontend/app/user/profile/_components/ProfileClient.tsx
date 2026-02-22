"use client";

import { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import EditProfileForm from "./EditProfileForm";
import AddPostModal from "./AddPostModal";
import ProfilePostsWidget from "./ProfilePostsWidget";
import type { PostItem } from "../schema";

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
}: {
  user: ProfileUser;
  currentUserId?: string;
  viewerProfileUrl?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>(user.initialPosts || []);

  const profileUserId = user.id || user._id || "";
  const viewerUserId = currentUserId || "";
  const canManageProfile = !!viewerUserId && viewerUserId === profileUserId;

  return (
    <>
      {!isEditing ? (
        <ProfileDetails
          user={user}
          onEdit={canManageProfile ? () => setIsEditing(true) : undefined}
          onAddPost={canManageProfile ? () => setIsAddPostOpen(true) : undefined}
          canManageProfile={canManageProfile}
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
