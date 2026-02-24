"use client";

import Link from "next/link";

type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type ConversationItem = {
  _id?: string;
  participants?: Array<string | FriendUser>;
  lastMessage?: string;
};

const buildProfileImageUrl = (profileUrl?: string) => {
  if (!profileUrl) return null;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${backendUrl}/uploads/profile/${profileUrl}`;
};

const getDisplayName = (friend: FriendUser) => {
  const name = `${friend.firstName || ""} ${friend.lastName || ""}`.trim();
  return name || friend.username || "User";
};

const getUserId = (user?: string | FriendUser) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id || "";
};

export default function LeftSidebar({
  friends = [],
  conversations = [],
  currentUserId = "",
}: {
  friends?: FriendUser[];
  conversations?: ConversationItem[];
  currentUserId?: string;
}) {
  const messageFriends = friends.slice(0, 10);
  const lastMessageByFriendId = new Map<string, string>();

  conversations.forEach((conversation) => {
    const otherParticipant = (conversation.participants || []).find(
      (participant) => getUserId(participant) !== currentUserId
    );
    const friendId = getUserId(otherParticipant);
    if (!friendId || lastMessageByFriendId.has(friendId)) return;
    lastMessageByFriendId.set(friendId, conversation.lastMessage || "No messages yet");
  });

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {/* Chautari */}
      <div className="flex flex-col">
        <h2 className="font-bold mb-2 text-gray-900 dark:text-zinc-100">Chautari</h2>
        <ul className="scrollbar-feed space-y-2 max-h-48 overflow-y-auto">
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Chautari_Guff</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Ramailo_Kura</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Vibes</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Meme_dokan</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Sports</li>
        </ul>
      </div>

      {/* Messages */}
      <div className="flex flex-col">
        <h2 className="font-bold mb-2 text-gray-900 dark:text-zinc-100">Messages</h2>
        <ul className="scrollbar-feed space-y-2 max-h-48 overflow-y-auto">
          {messageFriends.length === 0 && (
            <li className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              No friends yet.
            </li>
          )}

          {messageFriends.map((friend) => {
            const name = getDisplayName(friend);
            const avatar = buildProfileImageUrl(friend.profileUrl);
            return (
              <li key={friend._id || friend.username || name}>
                <Link
                  href={friend._id ? `/user/message?userId=${friend._id}` : "/user/message"}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-700 dark:text-zinc-200">
                        {name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{name}</p>
                    <p className="max-w-[12rem] truncate text-xs text-slate-500 dark:text-zinc-400">
                      {lastMessageByFriendId.get(friend._id || "") || "No messages yet"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
