"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  handleAssignAdminReport,
  handleGetAdminReportById,
  handleGetAdminReports,
  handleGetAdminReportStats,
  handleResolveAdminReport,
} from "@/lib/actions/admin/report-action";
import { handleDeleteAdminPost } from "@/lib/actions/admin/post-action";
import { handleUpdateModerationUserStatus } from "@/lib/actions/admin/moderation-action";
import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import { handleGetPostById } from "@/lib/actions/post-action";
import { handleGetChautariById } from "@/lib/actions/chautari-action";
import type { ActionTaken, ReportStatus, ResolveReportPayload } from "@/lib/api/admin/report";
import { actionOptionsContent, actionOptionsUser } from "./constants";
import {
  DEFAULT_RESOLVE_FORM,
  getUserAccountStatus,
  type Pagination,
  type PostPreview,
  type ReportFilters,
  type ReportItem,
  type ReportStats,
  type TargetPreview,
  type UserAccountStatus,
} from "./types";

export function useReportsPage() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
  const buildPostMediaUrl = (mediaUrl: string, mediaType: string) =>
    `${backendUrl}/uploads/posts/${mediaType === "video" ? "videos" : "images"}/${mediaUrl}`;

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [stats, setStats] = useState<ReportStats>({});
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 200,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState<ReportFilters>({
    status: "",
    targetType: "",
    assignedTo: "",
  });

  const [assigningReportId, setAssigningReportId] = useState<string | null>(null);
  const [assignToInput, setAssignToInput] = useState("");

  const [resolveReportId, setResolveReportId] = useState<string | null>(null);
  const [resolveForm, setResolveForm] = useState<ResolveReportPayload>(DEFAULT_RESOLVE_FORM);

  const [viewReportId, setViewReportId] = useState<string | null>(null);
  const [viewReportData, setViewReportData] = useState<ReportItem | null>(null);
  const [viewReportLoading, setViewReportLoading] = useState(false);

  const [targetPreview, setTargetPreview] = useState<TargetPreview | null>(null);
  const [targetPreviewLoading, setTargetPreviewLoading] = useState(false);

  const [userStatusById, setUserStatusById] = useState<Record<string, UserAccountStatus>>({});
  const [postPreviewById, setPostPreviewById] = useState<Record<string, PostPreview>>({});
  const [communityDeletedById, setCommunityDeletedById] = useState<Record<string, boolean>>({});

  const loadStats = async () => {
    const response = await handleGetAdminReportStats();
    if (!response.success) {
      toast.error(response.message || "Failed to load report stats");
      return;
    }
    setStats((response.data || {}) as ReportStats);
  };

  const loadReports = async (page = pagination.page, size = pagination.size) => {
    setLoading(true);
    const query: {
      page: number;
      size: number;
      status?: ReportStatus;
      targetType?: "user" | "post" | "comment" | "message" | "community";
      assignedTo?: string;
    } = { page, size };

    if (filters.status) query.status = filters.status;
    if (filters.targetType) {
      query.targetType = filters.targetType as
        | "user"
        | "post"
        | "comment"
        | "message"
        | "community";
    }
    if (filters.assignedTo.trim()) query.assignedTo = filters.assignedTo.trim();

    const response = await handleGetAdminReports(query);

    if (!response.success) {
      toast.error(response.message || "Failed to load reports");
      setLoading(false);
      return;
    }

    setReports((response.data as ReportItem[]) || []);
    const paginationData = response.pagination as Pagination | null;
    if (paginationData) {
      setPagination(paginationData);
    } else {
      setPagination((prev) => ({ ...prev, page }));
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadStats();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadReports(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters.status, filters.targetType, filters.assignedTo]);

  useEffect(() => {
    const userIds = Array.from(
      new Set(
        reports
          .filter((item) => item.targetType === "user" && item.targetId)
          .map((item) => item.targetId as string)
      )
    );

    const missingIds = userIds.filter((id) => !userStatusById[id]);
    if (missingIds.length === 0) return;

    let cancelled = false;
    const loadStatuses = async () => {
      const entries = await Promise.all(
        missingIds.map(async (id) => {
          const response = await handleGetOneUser(id);
          if (response.success && response.data) {
            return [id, getUserAccountStatus(response.data as Record<string, unknown>)] as const;
          }
          return [id, "deleted" as UserAccountStatus] as const;
        })
      );

      if (cancelled) return;
      setUserStatusById((prev) => {
        const next = { ...prev };
        for (const [id, status] of entries) next[id] = status;
        return next;
      });
    };

    void loadStatuses();
    return () => {
      cancelled = true;
    };
  }, [reports, userStatusById]);

  useEffect(() => {
    const postIds = Array.from(
      new Set(
        reports
          .filter((item) => item.targetType === "post" && item.targetId)
          .map((item) => item.targetId as string)
      )
    );

    const missingIds = postIds.filter((id) => !postPreviewById[id]);
    if (missingIds.length === 0) return;

    let cancelled = false;
    const loadPostPreviews = async () => {
      const entries = await Promise.all(
        missingIds.map(async (id) => {
          const response = await handleGetPostById(id);
          if (response.success && response.data) {
            const data = response.data as Record<string, unknown>;
            return [
              id,
              {
                caption: String(data.caption || data.text || data.content || ""),
                mediaUrl: String(data.mediaUrl || ""),
                mediaType: String(data.mediaType || ""),
                deleted: false,
              } as PostPreview,
            ] as const;
          }

          return [
            id,
            {
              caption: "",
              mediaUrl: "",
              mediaType: "",
              deleted: true,
            } as PostPreview,
          ] as const;
        })
      );

      if (cancelled) return;
      setPostPreviewById((prev) => {
        const next = { ...prev };
        for (const [id, preview] of entries) next[id] = preview;
        return next;
      });
    };

    void loadPostPreviews();
    return () => {
      cancelled = true;
    };
  }, [reports, postPreviewById]);

  useEffect(() => {
    const communityIds = Array.from(
      new Set(
        reports
          .filter((item) => item.targetType === "community" && item.targetId)
          .map((item) => item.targetId as string)
      )
    );

    const missingIds = communityIds.filter((id) => communityDeletedById[id] === undefined);
    if (missingIds.length === 0) return;

    let cancelled = false;
    const loadCommunityStates = async () => {
      const entries = await Promise.all(
        missingIds.map(async (id) => {
          const response = await handleGetChautariById(id);
          return [id, !response.success || !response.data] as const;
        })
      );

      if (cancelled) return;
      setCommunityDeletedById((prev) => {
        const next = { ...prev };
        for (const [id, deleted] of entries) next[id] = deleted;
        return next;
      });
    };

    void loadCommunityStates();
    return () => {
      cancelled = true;
    };
  }, [reports, communityDeletedById]);

  const selectedReport = useMemo(
    () => reports.find((item) => item._id === resolveReportId) || null,
    [reports, resolveReportId]
  );

  const visibleReports = useMemo(() => reports, [reports]);

  const resolveActionOptions: ActionTaken[] =
    selectedReport?.targetType === "user" ? actionOptionsUser : actionOptionsContent;

  const showSuspensionDays = resolveForm.actionTaken === "suspend";

  const onAssign = async () => {
    if (!assigningReportId || !assignToInput.trim()) {
      toast.error("assignedTo is required");
      return;
    }

    setBusyId(assigningReportId);
    const response = await handleAssignAdminReport(assigningReportId, assignToInput.trim());
    setBusyId(null);

    if (!response.success) {
      toast.error(response.message || "Failed to assign report");
      return;
    }

    toast.success(response.message || "Report assigned");
    setAssigningReportId(null);
    setAssignToInput("");
    await loadReports();
    await loadStats();
  };

  const onResolve = async () => {
    if (!resolveReportId) return;

    setBusyId(resolveReportId);
    const payload: ResolveReportPayload = {
      ...resolveForm,
      resolutionNote: resolveForm.resolutionNote?.trim() || undefined,
      suspensionDays: resolveForm.actionTaken === "suspend" ? resolveForm.suspensionDays : undefined,
    };

    const response = await handleResolveAdminReport(resolveReportId, payload);
    setBusyId(null);

    if (!response.success) {
      toast.error(response.message || "Failed to resolve report");
      return;
    }

    toast.success(response.message || "Report updated");
    setResolveReportId(null);
    await loadReports();
    await loadStats();
  };

  const onQuickUserStatusUpdate = async (
    report: ReportItem,
    action: "suspend" | "unsuspend" | "ban" | "unban"
  ) => {
    if (!report.targetId) {
      toast.error("Missing target user id");
      return;
    }

    setBusyId(report._id);
    const response = await handleUpdateModerationUserStatus(report.targetId, {
      action,
      suspensionDays: action === "suspend" ? 7 : undefined,
    });
    setBusyId(null);

    if (!response.success) {
      toast.error(response.message || "Failed to update user status");
      return;
    }

    setUserStatusById((prev) => ({
      ...prev,
      [report.targetId as string]:
        action === "suspend" ? "suspended" : action === "ban" ? "banned" : "active",
    }));
    toast.success(response.message || "User status updated");
  };

  const markReportResolvedAfterDelete = async (
    reportId: string,
    note: string,
    actionTaken: ActionTaken
  ) => {
    const response = await handleResolveAdminReport(reportId, {
      status: "resolved",
      actionTaken,
      resolutionNote: note,
    });

    if (!response.success) {
      toast.error(response.message || "Target deleted, but failed to resolve report");
      return false;
    }

    return true;
  };

  const onDeleteUser = async (report: ReportItem) => {
    if (!report.targetId) {
      toast.error("Missing target user id");
      return;
    }

    setBusyId(report._id);
    const response = await handleUpdateModerationUserStatus(report.targetId, { action: "delete" });
    setBusyId(null);

    if (!response.success) {
      toast.error(response.message || "Failed to delete user");
      return;
    }

    setUserStatusById((prev) => ({
      ...prev,
      [report.targetId as string]: "deleted",
    }));

    const resolved = await markReportResolvedAfterDelete(
      report._id,
      "Removed violating user account",
      "none"
    );
    if (resolved) {
      await loadReports();
      await loadStats();
      toast.success("User deleted and report resolved");
      return;
    }

    toast.success(response.message || "User deleted");
  };

  const onDeletePost = async (report: ReportItem) => {
    if (!report.targetId) {
      toast.error("Missing target post id");
      return;
    }

    setBusyId(report._id);
    const response = await handleDeleteAdminPost(report.targetId);
    setBusyId(null);

    if (!response.success) {
      toast.error(response.message || "Failed to delete post");
      return;
    }

    setPostPreviewById((prev) => ({
      ...prev,
      [report.targetId as string]: {
        caption: "",
        mediaUrl: "",
        mediaType: "",
        deleted: true,
      },
    }));

    const resolved = await markReportResolvedAfterDelete(
      report._id,
      "Removed violating post",
      "none"
    );
    if (resolved) {
      await loadReports();
      await loadStats();
      toast.success("Post deleted and report resolved");
      return;
    }

    toast.success(response.message || "Post deleted");
  };

  const onDeleteCommunity = async (report: ReportItem) => {
    setBusyId(report._id);
    const response = await handleResolveAdminReport(report._id, {
      status: "resolved",
      actionTaken: "delete",
      resolutionNote: "Removed harmful community",
    });
    setBusyId(null);

    if (!response.success) {
      toast.error(response.message || "Failed to delete chautari");
      return;
    }

    if (report.targetId) {
      setCommunityDeletedById((prev) => ({
        ...prev,
        [report.targetId as string]: true,
      }));
    }

    toast.success(response.message || "Chautari deleted");
    await loadReports();
    await loadStats();
  };

  const openViewReport = async (reportId: string) => {
    setViewReportId(reportId);
    setViewReportLoading(true);
    const response = await handleGetAdminReportById(reportId);
    setViewReportLoading(false);

    if (!response.success || !response.data) {
      toast.error(response.message || "Failed to load report details");
      return;
    }

    const rawData = response.data as { report?: ReportItem };
    const reportData = rawData.report || (response.data as ReportItem);
    setViewReportData(reportData);
  };

  const openTarget = async (report: ReportItem) => {
    if (!report.targetId || !report.targetType) {
      toast.error("Missing target details");
      return;
    }

    setTargetPreviewLoading(true);
    setTargetPreview(null);

    if (report.targetType === "user") {
      const response = await handleGetOneUser(report.targetId);
      setTargetPreviewLoading(false);
      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to fetch reported user");
        return;
      }
      setTargetPreview({ kind: "user", data: response.data as Record<string, unknown> });
      return;
    }

    if (report.targetType === "post") {
      const response = await handleGetPostById(report.targetId);
      setTargetPreviewLoading(false);
      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to fetch reported post");
        return;
      }
      setTargetPreview({ kind: "post", data: response.data as Record<string, unknown> });
      return;
    }

    if (report.targetType === "community") {
      const response = await handleGetChautariById(report.targetId);
      setTargetPreviewLoading(false);
      if (!response.success || !response.data) {
        toast.error(response.message || "Failed to fetch reported community");
        return;
      }
      setTargetPreview({ kind: "community", data: response.data as Record<string, unknown> });
      return;
    }

    setTargetPreviewLoading(false);
    toast.error(`Preview for target type "${report.targetType}" is not supported yet`);
  };

  const onRefresh = () => {
    void loadStats();
    void loadReports();
  };

  const onPrevPage = () => {
    if (pagination.page <= 1) return;
    void loadReports(pagination.page - 1);
  };

  const onNextPage = () => {
    if (pagination.page >= pagination.totalPages) return;
    void loadReports(pagination.page + 1);
  };

  return {
    stats,
    loading,
    busyId,
    pagination,
    filters,
    setFilters,
    visibleReports,
    userStatusById,
    postPreviewById,
    buildPostMediaUrl,
    onRefresh,
    onPrevPage,
    onNextPage,
    openViewReport,
    openTarget,
    setAssigningReportId,
    setAssignToInput,
    setResolveReportId,
    setResolveForm,
    onQuickUserStatusUpdate,
    onDeleteUser,
    onDeletePost,
    onDeleteCommunity,
    viewReportId,
    viewReportLoading,
    viewReportData,
    setViewReportId,
    setViewReportData,
    targetPreview,
    targetPreviewLoading,
    setTargetPreview,
    assigningReportId,
    assignToInput,
    onAssign,
    resolveReportId,
    selectedReport,
    resolveForm,
    resolveActionOptions,
    showSuspensionDays,
    onResolve,
  };
}
