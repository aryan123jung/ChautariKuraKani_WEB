"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  isJoined: boolean;
  creatingPost: boolean;
  onClose: () => void;
  onSubmit: (payload: { caption: string; file: File | null }) => void;
};

export default function CreateChautariPostModal({
  isOpen,
  isJoined,
  creatingPost,
  onClose,
  onSubmit,
}: Props) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setCaption("");
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Create Chautari Post</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Share text, image, or video inside this community.
        </p>

        <div className="mt-4 space-y-3">
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder={isJoined ? "Write your post..." : "Join this Chautari to post"}
            disabled={!isJoined || creatingPost}
            className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />

          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 ${
              !isJoined || creatingPost ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <ImagePlus size={14} />
            {file ? file.name : "Add media"}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={!isJoined || creatingPost}
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isJoined || creatingPost}
            onClick={() => onSubmit({ caption, file })}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {creatingPost ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
