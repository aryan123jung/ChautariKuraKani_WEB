import { getUserData } from "@/lib/cookie";
import ProfileCover from "./_components/ProfileCover";
import ProfileAvatar from "./_components/ProfileAvatar";
import ProfileStats from "./_components/ProfileStats";
import ProfileClient from "./_components/ProfileClient";

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProfileCover coverUrl={user.coverUrl} />

      <div className="relative px-6">
        <ProfileAvatar profileUrl={user.profileUrl} />
        <ProfileClient user={user} />
        <ProfileStats user={user} />
      </div>
    </div>
  );
}
