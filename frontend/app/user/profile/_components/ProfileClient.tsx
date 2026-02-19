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

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>(user.initialPosts || []);

  const userId = user.id || user._id || "";

  return (
    <>
      {!isEditing ? (
        <ProfileDetails
          user={user}
          onEdit={() => setIsEditing(true)}
          onAddPost={() => setIsAddPostOpen(true)}
        />
      ) : (
        <EditProfileForm user={user} onCancel={() => setIsEditing(false)} />
      )}

      <AddPostModal
        isOpen={isAddPostOpen}
        onClose={() => setIsAddPostOpen(false)}
        onPostCreated={(post) => setPosts((prev) => [post, ...prev])}
      />

      {userId && (
        <ProfilePostsWidget
          userId={userId}
          currentUserProfileUrl={user.profileUrl}
          posts={posts}
          onPostsChange={setPosts}
        />
      )}
    </>
  );
}
