"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleCreatePost } from "@/lib/actions/post-action";
import type { PostItem } from "../schema";

export default function AddPostModal({
  isOpen,
  onClose,
  onPostCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: PostItem) => void;
}) {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!media) {
      setMediaPreview(null);
      return;
    }

    const preview = URL.createObjectURL(media);
    setMediaPreview(preview);

    return () => URL.revokeObjectURL(preview);
  }, [media]);

  useEffect(() => {
    if (!isOpen) {
      setCaption("");
      setMedia(null);
      setMediaPreview(null);
      setError(null);
      setIsSubmittingPost(false);
    }
  }, [isOpen]);

  const onMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType =
      file.type.startsWith("image/") || file.type.startsWith("video/");

    if (!isValidType) {
      setError("Only image or video files are allowed for posts");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Media size must be 5MB or less");
      return;
    }

    setError(null);
    setMedia(file);
  };

  const onCreatePost = async () => {
    const trimmedCaption = caption.trim();

    if (!trimmedCaption && !media) {
      setError("Post must contain either caption or media");
      return;
    }

    setError(null);
    setIsSubmittingPost(true);

    try {
      const formData = new FormData();

      if (trimmedCaption) {
        formData.append("caption", trimmedCaption);
      }

      if (media) {
        formData.append("media", media);
      }

      const response = await handleCreatePost(formData);
      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("Post created successfully");
      if (response.data) {
        onPostCreated(response.data as PostItem);
      }
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create post";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Media (Image/Video, max 5MB)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onMediaChange}
              className="mt-1 w-full text-sm"
            />
          </div>

          {media && <p className="text-sm text-gray-600">Selected: {media.name}</p>}

          {mediaPreview && media?.type.startsWith("image/") && (
            <Image
              src={mediaPreview}
              alt="Selected media preview"
              width={1200}
              height={800}
              unoptimized
              className="w-full max-h-80 object-contain rounded-md border"
            />
          )}

          {mediaPreview && media?.type.startsWith("video/") && (
            <video
              src={mediaPreview}
              controls
              className="w-full max-h-80 rounded-md border"
            />
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            disabled={isSubmittingPost}
          >
            Cancel
          </button>
          <button
            onClick={onCreatePost}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            disabled={isSubmittingPost}
          >
            {isSubmittingPost ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
