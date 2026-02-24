"use client";

import { ImagePlus } from "lucide-react";
import { FormEvent } from "react";

type Props = {
  isOpen: boolean;
  updatingCommunity: boolean;
  communityName: string;
  communityDescription: string;
  communityProfileFile: File | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onProfileFileChange: (file: File | null) => void;
};

export default function EditCommunityModal({
  isOpen,
  updatingCommunity,
  communityName,
  communityDescription,
  communityProfileFile,
  onClose,
  onSubmit,
  onNameChange,
  onDescriptionChange,
  onProfileFileChange,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Edit Chautari</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Update community name, description, and profile image.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-zinc-400">
              Name
            </label>
            <input
              value={communityName}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="c/NepalTalk"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-zinc-400">
              Description
            </label>
            <textarea
              value={communityDescription}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="General discussions"
              className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-zinc-400">
              Community profile image
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800">
              <ImagePlus size={14} />
              {communityProfileFile ? communityProfileFile.name : "Replace image (optional)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => onProfileFileChange(event.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingCommunity}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {updatingCommunity ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
