"use client";

import type { RefObject } from "react";
import type { CallHistoryItem, TimelineItem } from "./message-types";
import { getUserId } from "./message-helpers";

type Props = {
  activeConversationId: string | null;
  isLoadingMessages: boolean;
  timelineItems: TimelineItem[];
  currentUserId: string;
  getCallEventLabel: (call: CallHistoryItem) => string;
  bottomRef: RefObject<HTMLDivElement | null>;
};

export default function MessageTimeline({
  activeConversationId,
  isLoadingMessages,
  timelineItems,
  currentUserId,
  getCallEventLabel,
  bottomRef,
}: Props) {
  return (
    <div className="scrollbar-feed min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
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
        timelineItems.map((entry) => {
          if (entry.kind === "call") {
            const call = entry.item;
            return (
              <div key={`call-${call._id}`} className="flex justify-center">
                <div className="max-w-[80%] rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {getCallEventLabel(call)}
                  <span className="ml-2 text-[10px] text-slate-500 dark:text-zinc-400">
                    {call.createdAt ? new Date(call.createdAt).toLocaleTimeString() : ""}
                  </span>
                </div>
              </div>
            );
          }

          const message = entry.item;
          const isMine = getUserId(message.senderId) === currentUserId;
          return (
            <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
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
  );
}
