"use client";

import { Send } from "lucide-react";

type Props = {
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSubmit: () => void;
  activeConversationId: string | null;
  isSending: boolean;
};

export default function MessageComposer({
  messageInput,
  onMessageInputChange,
  onSubmit,
  activeConversationId,
  isSending,
}: Props) {
  return (
    <div className="border-t border-slate-200 p-3 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <input
          value={messageInput}
          onChange={(event) => onMessageInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
          disabled={!activeConversationId || isSending}
          placeholder={activeConversationId ? "Type a message..." : "Select conversation first"}
          className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
        />
        <button
          onClick={onSubmit}
          disabled={!activeConversationId || isSending || !messageInput.trim()}
          className="rounded-full bg-[#76C05D] p-2 text-white transition hover:bg-[#67a94f] disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
