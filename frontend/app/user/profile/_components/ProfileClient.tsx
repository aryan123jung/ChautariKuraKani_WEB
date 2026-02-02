"use client";

import { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import EditProfileForm from "./EditProfileForm";

export default function ProfileClient({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {!isEditing ? (
        <ProfileDetails user={user} onEdit={() => setIsEditing(true)} />
      ) : (
        <EditProfileForm user={user} onCancel={() => setIsEditing(false)} />
      )}
    </>
  );
}
