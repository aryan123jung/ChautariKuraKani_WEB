import { getUserData } from "@/lib/cookie";
import ChautariClient from "./_components/ChautariClient";

export default async function ChautariPage({
  searchParams,
}: {
  searchParams?: Promise<{ communityId?: string }>;
}) {
  const user = await getUserData();
  const params = searchParams ? await searchParams : undefined;

  if (!user) {
    return <div className="p-6 text-sm text-slate-500">User not found</div>;
  }

  return (
    <ChautariClient
      currentUserId={user.id || user._id || ""}
      initialCommunityId={params?.communityId || ""}
    />
  );
}
