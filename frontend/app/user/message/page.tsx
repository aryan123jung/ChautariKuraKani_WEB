import { getUserData } from "@/lib/cookie";
import MessageClient from "./_components/MessageClient";

export default async function MessagePage() {
  const user = await getUserData();

  if (!user) {
    return <div className="p-6 text-sm text-slate-500">User not found</div>;
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden p-4">
      <MessageClient
        currentUserId={user.id || user._id}
      />
    </div>
  );
}
