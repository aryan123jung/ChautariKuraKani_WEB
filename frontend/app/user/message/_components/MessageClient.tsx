"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { handleGetMyFriends } from "@/lib/actions/friend-action";
import {
  handleGetOrCreateConversation,
  handleListConversations,
  handleListMessages,
  handleMarkConversationRead,
  handleSendMessage,
} from "@/lib/actions/message-action";

type FriendUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type ConversationItem = {
  _id: string;
  participants?: Array<string | FriendUser>;
  lastMessage?: string;
  lastMessageAt?: string;
  updatedAt?: string;
};

type MessageUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileUrl?: string;
};

type MessageItem = {
  _id: string;
  conversationId: string;
  senderId: string | MessageUser;
  receiverId: string | MessageUser;
  text: string;
  createdAt?: string;
  readBy?: string[];
};

const getUserId = (user: string | MessageUser | FriendUser | undefined) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id || "";
};

const getUserName = (user: string | MessageUser | FriendUser | undefined) => {
  if (!user || typeof user === "string") return "User";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
};

const getUserAvatar = (user: string | MessageUser | FriendUser | undefined) => {
  if (!user || typeof user === "string") return null;
  return user.profileUrl || null;
};

const buildProfileImageUrl = (profileUrl?: string | null) => {
  if (!profileUrl) return null;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  return `${backendUrl}/uploads/profile/${profileUrl}`;
};

const getAuthTokenFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export default function MessageClient({ currentUserId }: { currentUserId: string }) {
  const searchParams = useSearchParams();
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  const activeChatUser = useMemo(() => {
    if (!activeConversation) return null;
    return (activeConversation.participants || []).find(
      (participant) => getUserId(participant) !== currentUserId
    );
  }, [activeConversation, currentUserId]);

  const filteredFriends = useMemo(() => {
    const keyword = friendSearch.trim().toLowerCase();
    if (!keyword) return friends;

    return friends.filter((friend) => {
      const name = `${friend.firstName || ""} ${friend.lastName || ""}`.toLowerCase();
      return (
        name.includes(keyword) ||
        (friend.username || "").toLowerCase().includes(keyword)
      );
    });
  }, [friends, friendSearch]);

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const response = await handleListConversations(1, 50);
      if (response.success) {
        const conversationList = (response.data || []) as ConversationItem[];
        setConversations(conversationList);
        if (!activeConversationId && conversationList.length > 0) {
          setActiveConversationId(conversationList[0]._id);
        }
      } else {
        setConversations([]);
      }
    } finally {
      setIsLoadingConversations(false);
    }
  }, [activeConversationId]);

  const loadFriends = useCallback(async () => {
    const response = await handleGetMyFriends(1, 200);
    if (response.success) {
      setFriends((response.data || []) as FriendUser[]);
    }
  }, []);

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await handleListMessages(conversationId, 1, 100);
      if (response.success) {
        const data = ((response.data || []) as MessageItem[]).slice().reverse();
        setMessages(data);
      } else {
        setMessages([]);
      }
      await handleMarkConversationRead(conversationId);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    void Promise.all([loadConversations(), loadFriends()]);
  }, [loadConversations, loadFriends]);

  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    const conversationIdParam = searchParams.get("conversationId");

    if (conversationIdParam) {
      setActiveConversationId(conversationIdParam);
    }

    if (userIdParam) {
      void startConversation(userIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    void loadMessages(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = getAuthTokenFromCookie();
    if (!token) return;
    if (socketRef.current) return;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
    const socket = io(backendUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("message:new", (incomingMessage: MessageItem) => {
      setConversations((prev) => {
        const exists = prev.some((conversation) => conversation._id === incomingMessage.conversationId);
        const updated = prev.map((conversation) =>
          conversation._id === incomingMessage.conversationId
            ? {
                ...conversation,
                lastMessage: incomingMessage.text,
                lastMessageAt: incomingMessage.createdAt,
              }
            : conversation
        );

        if (!exists) {
          return prev;
        }

        return updated.sort((a, b) => {
          const aTime = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
          const bTime = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
          return bTime - aTime;
        });
      });

      const senderId = getUserId(incomingMessage.senderId);
      if (incomingMessage.conversationId === activeConversationId) {
        setMessages((prev) => {
          if (prev.some((message) => message._id === incomingMessage._id)) return prev;
          return [...prev, incomingMessage];
        });
        if (senderId !== currentUserId) {
          void handleMarkConversationRead(incomingMessage.conversationId);
        }
      } else if (senderId !== currentUserId) {
        toast.info("New message received");
      }
    });

    socketRef.current = socket;
    return () => {
      socket.off("message:new");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeConversationId, currentUserId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeConversationId) return;

    socket.emit("conversation:join", activeConversationId);
    return () => {
      socket.emit("conversation:leave", activeConversationId);
    };
  }, [activeConversationId]);

  const startConversation = async (friendId?: string) => {
    if (!friendId) return;
    const response = await handleGetOrCreateConversation(friendId);
    if (!response.success || !response.data) {
      toast.error(response.message || "Could not open conversation");
      return;
    }

    const conversation = response.data as ConversationItem;
    setConversations((prev) => {
      if (prev.some((item) => item._id === conversation._id)) return prev;
      return [conversation, ...prev];
    });
    setActiveConversationId(conversation._id);
  };

  const sendMessageNow = async () => {
    if (!activeConversationId || isSending) return;
    const text = messageInput.trim();
    if (!text) return;

    setIsSending(true);
    try {
      const response = await handleSendMessage(activeConversationId, text);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to send message");
      }

      const message = response.data as MessageItem;
      setMessages((prev) => {
        if (prev.some((item) => item._id === message._id)) return prev;
        return [...prev, message];
      });
      setMessageInput("");

      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation._id === activeConversationId
              ? { ...conversation, lastMessage: message.text, lastMessageAt: message.createdAt }
              : conversation
          )
          .sort((a, b) => {
            const aTime = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
            const bTime = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
            return bTime - aTime;
          })
      );
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="grid h-full grid-cols-12 gap-4">
      <aside className="col-span-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-zinc-100">Messages</h2>

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
            Start Chat (Friends)
          </p>
          <input
            value={friendSearch}
            onChange={(event) => setFriendSearch(event.target.value)}
            placeholder="Search friends..."
            className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
          />
          <div className="scrollbar-feed flex gap-2 overflow-x-auto pb-1">
            {filteredFriends.map((friend) => (
              <button
                key={friend._id || friend.username}
                onClick={() => void startConversation(friend._id)}
                className="whitespace-nowrap rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {getUserName(friend)}
              </button>
            ))}
            {filteredFriends.length === 0 && (
              <span className="text-xs text-slate-500 dark:text-zinc-400">No friends found</span>
            )}
          </div>
        </div>

        <div className="scrollbar-feed h-[calc(100%-7rem)] space-y-2 overflow-y-auto pr-1">
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
                onClick={() => setActiveConversationId(conversation._id)}
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
                      {conversation.lastMessage || "Say hello"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="col-span-8 flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
            {activeChatUser ? getUserName(activeChatUser) : "Select a conversation"}
          </h3>
        </div>

        <div className="scrollbar-feed flex-1 space-y-3 overflow-y-auto p-4">
          {!activeConversationId && (
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Select a conversation from the left or start one with a friend.
            </p>
          )}

          {activeConversationId && isLoadingMessages && (
            <p className="text-sm text-slate-500 dark:text-zinc-400">Loading messages...</p>
          )}

          {activeConversationId &&
            !isLoadingMessages &&
            messages.map((message) => {
              const isMine = getUserId(message.senderId) === currentUserId;
              return (
                <div
                  key={message._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      isMine
                        ? "bg-[#76C05D] text-white"
                        : "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        isMine ? "text-white/80" : "text-slate-500 dark:text-zinc-400"
                      }`}
                    >
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <input
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void sendMessageNow();
                }
              }}
              disabled={!activeConversationId || isSending}
              placeholder={activeConversationId ? "Type a message..." : "Select conversation first"}
              className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
            />
            <button
              onClick={() => void sendMessageNow()}
              disabled={!activeConversationId || isSending || !messageInput.trim()}
              className="rounded-full bg-[#76C05D] p-2 text-white transition hover:bg-[#67a94f] disabled:opacity-60"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}
