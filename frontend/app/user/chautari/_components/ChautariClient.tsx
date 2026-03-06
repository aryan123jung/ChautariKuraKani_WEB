"use client";

import {
  handleCreateChautari,
  handleCreateChautariPost,
  handleDeleteChautari,
  handleGetChautariById,
  handleGetChautariMemberCount,
  handleGetChautariPosts,
  handleJoinChautari,
  handleLeaveChautari,
  handleUpdateChautari,
} from "@/lib/actions/chautari-action";
import {
  handleCreateComment,
  handleDeleteComment,
  handleDeletePost,
  handleLikePost,
  handleUpdatePost,
} from "@/lib/actions/post-action";
import { handleReportChautari } from "@/lib/actions/report-action";
import type { CreateReportPayload } from "@/lib/api/report";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ReportModal from "@/app/user/_components/ReportModal";
import type {
  CommunityItem,
  CommunityPost,
  CommunityPostComment,
} from "../schema";
import CommunityCommentsModal from "./CommunityCommentsModal";
import CommunityFeedPanel from "./CommunityFeedPanel";
import CreateCommunityModal from "./CreateCommunityModal";
import CreateChautariPostModal from "./CreateChautariPostModal";
import DeleteModal from "./DeleteModal";
import EditCommunityModal from "./EditCommunityModal";
import EditChautariPostModal from "./EditChautariPostModal";
import MyChautariSidebar from "./MyChautariSidebar";
import {
  MY_CHAUTARI_IDS_KEY,
  getEntityId,
  getCommentAuthorName,
  getCommentAvatarUrl,
  getCommentUserId,
  normalizeCommunityName,
} from "./chautari-utils";

export default function ChautariClient({
  currentUserId,
  initialCommunityId = "",
}: {
  currentUserId: string;
  initialCommunityId?: string;
}) {

  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const [myCommunities, setMyCommunities] = useState<CommunityItem[]>([]);

  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [joiningOrLeaving, setJoiningOrLeaving] = useState(false);
  const [deletingCommunity, setDeletingCommunity] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [deletePostTargetId, setDeletePostTargetId] = useState<string | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [isSavingEditPost, setIsSavingEditPost] = useState(false);

  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [newCommunityProfileFile, setNewCommunityProfileFile] = useState<File | null>(null);
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [isEditCommunityOpen, setIsEditCommunityOpen] = useState(false);
  const [editCommunityName, setEditCommunityName] = useState("");
  const [editCommunityDescription, setEditCommunityDescription] = useState("");
  const [editCommunityProfileFile, setEditCommunityProfileFile] = useState<File | null>(null);
  const [updatingCommunity, setUpdatingCommunity] = useState(false);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postModalSession, setPostModalSession] = useState(0);
  const [creatingPost, setCreatingPost] = useState(false);
  const [busyPostId, setBusyPostId] = useState<string | null>(null);
  const [isCommunityMenuOpen, setIsCommunityMenuOpen] = useState(false);
  const [isReportCommunityOpen, setIsReportCommunityOpen] = useState(false);
  const [isSubmittingCommunityReport, setIsSubmittingCommunityReport] = useState(false);
  const [commentsModalPostId, setCommentsModalPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const isJoined = useMemo(() => {
    const members = selectedCommunity?.members || [];
    return members.some((member) => getEntityId(member) === currentUserId);
  }, [selectedCommunity, currentUserId]);

  const isCreator = useMemo(() => {
    if (!selectedCommunity) return false;
    return getEntityId(selectedCommunity.creatorId) === currentUserId;
  }, [selectedCommunity, currentUserId]);

  const activeCommentPost = commentsModalPostId
    ? posts.find((post) => post._id === commentsModalPostId) || null
    : null;

  const persistMyCommunityIds = (items: CommunityItem[]) => {
    if (typeof window === "undefined") return;
    const ids = Array.from(
      new Set(items.map((item) => item._id).filter(Boolean))
    );
    window.localStorage.setItem(MY_CHAUTARI_IDS_KEY, JSON.stringify(ids));
  };

  const sanitizeMyCommunities = useCallback((communities: CommunityItem[]) => {
    const uniqueById = new Map<string, CommunityItem>();

    communities.forEach((community) => {
      if (!community?._id) return;
      uniqueById.set(community._id, community);
    });

    return Array.from(uniqueById.values()).filter((community) => {
      const isOwner = getEntityId(community.creatorId) === currentUserId;
      const isMember = (community.members || []).some(
        (member) => getEntityId(member) === currentUserId
      );
      return isOwner || isMember;
    });
  }, [currentUserId]);

  const upsertMyCommunity = (community: CommunityItem) => {
    const joined = (community.members || []).some(
      (member) => getEntityId(member) === currentUserId
    );
    const creator = getEntityId(community.creatorId) === currentUserId;

    setMyCommunities((prev) => {
      const exists = prev.some((item) => item._id === community._id);

      if (!joined && !creator) {
        const filtered = prev.filter((item) => item._id !== community._id);
        persistMyCommunityIds(filtered);
        return filtered;
      }

      const next = exists
        ? prev.map((item) => (item._id === community._id ? community : item))
        : [community, ...prev];

      persistMyCommunityIds(next);
      return next;
    });
  };

  const removeCommunityFromLocalState = (communityId: string) => {
    setMyCommunities((prev) => {
      const next = prev.filter((item) => item._id !== communityId);
      persistMyCommunityIds(next);
      return next;
    });

    if (selectedCommunityId === communityId) {
      setSelectedCommunityId(null);
      setSelectedCommunity(null);
      setPosts([]);
      setMemberCount(0);
    }
  };

  const loadCommunity = async (communityId: string) => {
    setLoadingCommunity(true);
    try {
      const [communityResponse, memberCountResponse, postsResponse] = await Promise.all([
        handleGetChautariById(communityId),
        handleGetChautariMemberCount(communityId),
        handleGetChautariPosts(communityId, 1, 50),
      ]);

      if (!communityResponse.success || !communityResponse.data) {
        throw new Error(communityResponse.message || "Community not found");
      }

      const community = communityResponse.data as CommunityItem;
      setSelectedCommunity(community);
      setMemberCount(Number(memberCountResponse.data?.count || 0));
      setPosts((postsResponse.data || []) as CommunityPost[]);
      upsertMyCommunity(community);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load community");
    } finally {
      setLoadingCommunity(false);
    }
  };

  const onSelectCommunity = async (communityId: string) => {
    if (loadingCommunity || selectedCommunityId === communityId) return;
    setSelectedCommunityId(communityId);
    await loadCommunity(communityId);
  };

  const onCreateCommunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creatingCommunity) return;

    const normalizedName = normalizeCommunityName(newCommunityName);
    if (!normalizedName) {
      toast.error("Community name is required");
      return;
    }

    setCreatingCommunity(true);
    try {
      const formData = new FormData();
      formData.append("name", normalizedName);
      if (newCommunityDescription.trim()) {
        formData.append("description", newCommunityDescription.trim());
      }
      if (newCommunityProfileFile) {
        formData.append("communityProfileUrl", newCommunityProfileFile);
      }

      const response = await handleCreateChautari(formData);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create community");
      }

      const created = response.data as CommunityItem;
      toast.success(response.message || "Community created");
      setIsCreateCommunityOpen(false);
      setNewCommunityName("");
      setNewCommunityDescription("");
      setNewCommunityProfileFile(null);

      setSelectedCommunityId(created._id);
      await loadCommunity(created._id);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create community");
    } finally {
      setCreatingCommunity(false);
    }
  };

  const onJoinOrLeave = async () => {
    if (!selectedCommunityId || joiningOrLeaving) return;

    setJoiningOrLeaving(true);
    try {
      const response = isJoined
        ? await handleLeaveChautari(selectedCommunityId)
        : await handleJoinChautari(selectedCommunityId);

      if (!response.success) {
        throw new Error(response.message || (isJoined ? "Leave failed" : "Join failed"));
      }

      toast.success(response.message || (isJoined ? "Left community" : "Joined community"));
      await loadCommunity(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setJoiningOrLeaving(false);
    }
  };

  const onOpenEditCommunity = () => {
    if (!selectedCommunity || !isCreator) return;
    setEditCommunityName(selectedCommunity.name || (selectedCommunity.slug ? `c/${selectedCommunity.slug}` : ""));
    setEditCommunityDescription(selectedCommunity.description || "");
    setEditCommunityProfileFile(null);
    setIsEditCommunityOpen(true);
  };

  const onUpdateCommunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCommunityId || !isCreator || updatingCommunity) return;

    const normalizedName = normalizeCommunityName(editCommunityName);
    const originalName = selectedCommunity?.name || (selectedCommunity?.slug ? `c/${selectedCommunity.slug}` : "");
    const trimmedDescription = editCommunityDescription.trim();
    const originalDescription = (selectedCommunity?.description || "").trim();

    const hasNameChange = normalizedName && normalizedName !== originalName;
    const hasDescriptionChange = trimmedDescription !== originalDescription;
    const hasImageChange = Boolean(editCommunityProfileFile);

    if (!hasNameChange && !hasDescriptionChange && !hasImageChange) {
      toast.error("No changes to update");
      return;
    }

    setUpdatingCommunity(true);
    try {
      const formData = new FormData();
      if (hasNameChange) formData.append("name", normalizedName);
      if (hasDescriptionChange) formData.append("description", trimmedDescription);
      if (editCommunityProfileFile) {
        formData.append("communityProfileUrl", editCommunityProfileFile);
      }

      const response = await handleUpdateChautari(selectedCommunityId, formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update community");
      }

      toast.success(response.message || "Community updated");
      setIsEditCommunityOpen(false);
      setEditCommunityProfileFile(null);
      await loadCommunity(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update community");
    } finally {
      setUpdatingCommunity(false);
    }
  };

  const onDeleteCommunity = async () => {
    if (!selectedCommunityId || deletingCommunity || !isCreator) return;

    setDeletingCommunity(true);
    try {
      const response = await handleDeleteChautari(selectedCommunityId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete community");
      }

      toast.success(response.message || "Community deleted");
      removeCommunityFromLocalState(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete community");
    } finally {
      setDeletingCommunity(false);
    }
  };

  const canDeletePost = (post: CommunityPost) => {
    const postAuthorId = getEntityId(post.authorId);
    return postAuthorId === currentUserId || isCreator;
  };

  const canEditPost = (post: CommunityPost) => {
    const postAuthorId = getEntityId(post.authorId);
    return postAuthorId === currentUserId;
  };

  const onDeletePost = async (postId: string) => {
    if (!postId || isDeletingPost) return;

    setIsDeletingPost(true);
    try {
      const response = await handleDeletePost(postId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete post");
      }

      toast.success(response.message || "Post deleted");
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setCommentsModalPostId((prev) => (prev === postId ? null : prev));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete post");
    } finally {
      setIsDeletingPost(false);
    }
  };

  const onSubmitCommunityReport = async (payload: CreateReportPayload) => {
    if (!selectedCommunityId || isSubmittingCommunityReport) return;

    setIsSubmittingCommunityReport(true);
    try {
      const response = await handleReportChautari(selectedCommunityId, payload);
      if (!response.success) {
        throw new Error(response.message || "Failed to report chautari");
      }
      toast.success(response.message || "Chautari reported");
      setIsReportCommunityOpen(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to report chautari");
    } finally {
      setIsSubmittingCommunityReport(false);
    }
  };

  const onCreatePost = async ({
    caption,
    file,
  }: {
    caption: string;
    file: File | null;
  }) => {
    if (!selectedCommunityId || creatingPost) return;

    const trimmedCaption = caption.trim();
    if (!trimmedCaption && !file) {
      toast.error("Post must contain either caption or media");
      return;
    }

    const formData = new FormData();
    if (trimmedCaption) formData.append("caption", trimmedCaption);
    if (file) formData.append("media", file);

    setCreatingPost(true);
    try {
      const response = await handleCreateChautariPost(selectedCommunityId, formData);
      if (!response.success) {
        throw new Error(response.message || "Failed to create post");
      }

      toast.success(response.message || "Post created");
      setIsCreatePostOpen(false);
      await loadCommunity(selectedCommunityId);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setCreatingPost(false);
    }
  };

  const onEditPost = async ({
    caption,
    file,
  }: {
    caption: string;
    file: File | null;
  }) => {
    if (!editingPost || isSavingEditPost) return;

    const trimmedCaption = caption.trim();
    if (!trimmedCaption && !file && !editingPost.mediaUrl) {
      toast.error("Post must contain either caption or media");
      return;
    }

    setIsSavingEditPost(true);
    try {
      const formData = new FormData();
      formData.append("caption", trimmedCaption);
      if (file) formData.append("media", file);

      const response = await handleUpdatePost(editingPost._id, formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update post");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) =>
        prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
      toast.success(response.message || "Post updated");
      setEditingPost(null);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update post");
    } finally {
      setIsSavingEditPost(false);
    }
  };

  const hasLiked = (post: CommunityPost) =>
    (post.likes || []).some((likedBy) => likedBy?.toString() === currentUserId);

  const canDeleteComment = (comment: CommunityPostComment) => {
    const commentUserId = getCommentUserId(comment);
    const postOwnerId = activeCommentPost ? getEntityId(activeCommentPost.authorId) : "";
    return commentUserId === currentUserId || postOwnerId === currentUserId;
  };

  const onLikePost = async (postId: string) => {
    if (busyPostId) return;
    setBusyPostId(postId);
    try {
      const response = await handleLikePost(postId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to like post");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) => prev.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to like post");
    } finally {
      setBusyPostId(null);
    }
  };

  const onOpenComments = (postId: string) => {
    setCommentsModalPostId(postId);
    setCommentInput("");
  };

  const onSubmitComment = async () => {
    if (!commentsModalPostId || busyPostId) return;
    const text = commentInput.trim();
    if (!text) return;

    setBusyPostId(commentsModalPostId);
    try {
      const response = await handleCreateComment(commentsModalPostId, text);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to add comment");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) =>
        prev.map((post) => (post._id === commentsModalPostId ? updatedPost : post))
      );
      setCommentInput("");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to add comment");
    } finally {
      setBusyPostId(null);
    }
  };

  const onDeleteCommentForPost = async (commentId: string) => {
    if (!commentsModalPostId || busyPostId) return;
    setBusyPostId(commentsModalPostId);
    try {
      const response = await handleDeleteComment(commentsModalPostId, commentId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to delete comment");
      }

      const updatedPost = response.data as CommunityPost;
      setPosts((prev) =>
        prev.map((post) => (post._id === commentsModalPostId ? updatedPost : post))
      );
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete comment");
    } finally {
      setBusyPostId(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(MY_CHAUTARI_IDS_KEY);
    if (!raw) return;

    let ids: string[] = [];
    try {
      ids = JSON.parse(raw) as string[];
    } catch {
      ids = [];
    }

    if (!ids.length) return;

    void Promise.all(ids.map((id) => handleGetChautariById(id))).then((responses) => {
      const communities = responses
        .filter((response) => response.success && response.data)
        .map((response) => response.data as CommunityItem);

      const sanitized = sanitizeMyCommunities(communities);
      setMyCommunities(sanitized);
      persistMyCommunityIds(sanitized);
    });
  }, [sanitizeMyCommunities]);

  useEffect(() => {
    if (!initialCommunityId) return;
    setSelectedCommunityId(initialCommunityId);
    void loadCommunity(initialCommunityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCommunityId]);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden p-4">
      <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <CommunityFeedPanel
          selectedCommunity={selectedCommunity}
          loadingCommunity={loadingCommunity}
          memberCount={memberCount}
          posts={posts}
          isJoined={isJoined}
          isCreator={isCreator}
          joiningOrLeaving={joiningOrLeaving}
          deletingCommunity={deletingCommunity}
          updatingCommunity={updatingCommunity}
          isCommunityMenuOpen={isCommunityMenuOpen}
          busyPostId={busyPostId}
          onToggleCommunityMenu={() => setIsCommunityMenuOpen((prev) => !prev)}
          onOpenReportCommunity={() => {
            setIsCommunityMenuOpen(false);
            setIsReportCommunityOpen(true);
          }}
          onOpenEditCommunity={onOpenEditCommunity}
          onOpenCreatePost={() => {
            setPostModalSession((prev) => prev + 1);
            setIsCreatePostOpen(true);
          }}
          onOpenDeleteCommunity={() => setIsDeleteModalOpen(true)}
          onJoinOrLeave={() => void onJoinOrLeave()}
          canEditPost={canEditPost}
          canDeletePost={canDeletePost}
          onOpenEditPost={(post) => setEditingPost(post)}
          onOpenDeletePost={(postId) => {
            setDeletePostTargetId(postId);
            setIsDeletePostModalOpen(true);
          }}
          hasLiked={hasLiked}
          onLikePost={(postId) => void onLikePost(postId)}
          onOpenComments={onOpenComments}
        />

        <MyChautariSidebar
          myCommunities={myCommunities}
          currentUserId={currentUserId}
          selectedCommunityId={selectedCommunityId}
          onSelectCommunity={(communityId) => void onSelectCommunity(communityId)}
          onOpenCreate={() => setIsCreateCommunityOpen(true)}
        />
      </div>

      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        creatingCommunity={creatingCommunity}
        newCommunityName={newCommunityName}
        newCommunityDescription={newCommunityDescription}
        newCommunityProfileFile={newCommunityProfileFile}
        onClose={() => setIsCreateCommunityOpen(false)}
        onSubmit={(event) => void onCreateCommunity(event)}
        onNameChange={setNewCommunityName}
        onDescriptionChange={setNewCommunityDescription}
        onProfileFileChange={setNewCommunityProfileFile}
      />

      <EditCommunityModal
        isOpen={isEditCommunityOpen}
        updatingCommunity={updatingCommunity}
        communityName={editCommunityName}
        communityDescription={editCommunityDescription}
        communityProfileFile={editCommunityProfileFile}
        onClose={() => {
          setIsEditCommunityOpen(false);
          setEditCommunityProfileFile(null);
        }}
        onSubmit={(event) => void onUpdateCommunity(event)}
        onNameChange={setEditCommunityName}
        onDescriptionChange={setEditCommunityDescription}
        onProfileFileChange={setEditCommunityProfileFile}
      />

      <CreateChautariPostModal
        key={postModalSession}
        isOpen={isCreatePostOpen}
        isJoined={isJoined}
        creatingPost={creatingPost}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={(payload) => void onCreatePost(payload)}
      />

      <CommunityCommentsModal
        isOpen={Boolean(activeCommentPost)}
        onClose={() => {
          setCommentsModalPostId(null);
          setCommentInput("");
        }}
        comments={activeCommentPost?.comments || []}
        commentInput={commentInput}
        onCommentInputChange={setCommentInput}
        onSubmitComment={() => void onSubmitComment()}
        onDeleteComment={(commentId) => void onDeleteCommentForPost(commentId)}
        canDeleteComment={canDeleteComment}
        getCommentAuthorName={(comment) => getCommentAuthorName(comment, currentUserId)}
        getCommentAvatarUrl={getCommentAvatarUrl}
        isBusy={busyPostId === commentsModalPostId}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => void onDeleteCommunity()}
        title="Delete Chautari"
        description={`Are you sure you want to delete ${selectedCommunity?.name || selectedCommunity?.slug || "this community"}?`}
      />

      <DeleteModal
        isOpen={isDeletePostModalOpen}
        onClose={() => {
          setIsDeletePostModalOpen(false);
          setDeletePostTargetId(null);
        }}
        onConfirm={() => {
          if (deletePostTargetId) {
            void onDeletePost(deletePostTargetId);
          }
        }}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
      />

      <EditChautariPostModal
        key={`edit-post-${editingPost?._id || "none"}-${editingPost?.caption || ""}`}
        isOpen={Boolean(editingPost)}
        isSaving={isSavingEditPost}
        initialCaption={editingPost?.caption || ""}
        onClose={() => setEditingPost(null)}
        onSubmit={(payload) => void onEditPost(payload)}
      />

      <ReportModal
        isOpen={isReportCommunityOpen}
        onClose={() => setIsReportCommunityOpen(false)}
        targetLabel="Chautari"
        onSubmit={(payload) => void onSubmitCommunityReport(payload)}
        isSubmitting={isSubmittingCommunityReport}
      />
    </div>
  );
}
