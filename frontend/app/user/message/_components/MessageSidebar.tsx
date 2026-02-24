"use client";

import type { ConversationItem, FriendUser } from "./message-types";
import { buildProfileImageUrl, getUserAvatar, getUserId, getUserName } from "./message-helpers";

type Props = {
  friends: FriendUser[];
  friendSearch: string;
  onFriendSearchChange: (value: string) => void;
  onStartConversation: (friendId?: string) => void;
  conversations: ConversationItem[];
  activeConversationId: string | null;
  currentUserId: string;
  onSelectConversation: (conversationId: string) => void;
  isLoadingConversations: boolean;
};

export default function MessageSidebar({
  friends,
  friendSearch,
  onFriendSearchChange,
  onStartConversation,
  conversations,
  activeConversationId,
  currentUserId,
  onSelectConversation,
  isLoadingConversations,
}: Props) {
  return (
    <aside className="col-span-4 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-zinc-100">Messages</h2>

      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
          Start Chat (Friends)
        </p>
        <input
          value={friendSearch}
          onChange={(event) => onFriendSearchChange(event.target.value)}
          placeholder="Search friends..."
          className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
        />
        <div className="scrollbar-feed flex gap-2 overflow-x-auto pb-1">
          {friends.map((friend) => (
            <button
              key={friend._id || friend.username}
              onClick={() => onStartConversation(friend._id)}
              className="whitespace-nowrap rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {getUserName(friend)}
            </button>
          ))}
          {friends.length === 0 && (
            <span className="text-xs text-slate-500 dark:text-zinc-400">No friends found</span>
          )}
        </div>
      </div>

      <div className="scrollbar-feed min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {isLoadingConversations && (
          <p className="text-sm text-slate-500 dark:text-zinc-400">Loading conversations...</p>
        )}

        {!isLoadingConversations && conversations.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-zinc-400">No conversations yet.</p>
        )}

        {conversations.map((conversation) => {
          const otherParticipant = (conversation.participants || []).find(
            (participant) => getUserId(participant) !== currentUserId
          );
          const name = getUserName(otherParticipant);
          const avatar = buildProfileImageUrl(getUserAvatar(otherParticipant));
          const isActive = conversation._id === activeConversationId;

          return (
            <button
              key={conversation._id}
              onClick={() => onSelectConversation(conversation._id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                isActive
                  ? "border-green-500 bg-green-50 dark:border-emerald-500 dark:bg-zinc-800"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-700 dark:text-zinc-200">
                      {name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">{name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
