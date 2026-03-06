"use client";

import { useEffect, useState } from "react";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import { handleGetAdminPosts } from "@/lib/actions/admin/post-action";
import { handleGetAdminReportStats, handleGetAdminReports } from "@/lib/actions/admin/report-action";
import DashboardHeader from "./_components/DashboardHeader";
import MetricsGrid from "./_components/MetricsGrid";
import ReportTrendCard from "./_components/ReportTrendCard";
import TopReasonsBarCard from "./_components/TopReasonsBarCard";
import type { AdminPost, AdminReport, DashboardMetric, ReasonPoint, TrendPoint } from "./_components/types";

const pastDays = (days: number) => {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [reasonBreakdown, setReasonBreakdown] = useState<ReasonPoint[]>([]);

  const loadOverview = async () => {
    setLoading(true);

    const [usersRes, postsRes, reportStatsRes, reportsRes] = await Promise.all([
      handleGetAllUsers("1", "1", ""),
      handleGetAdminPosts(1, 100),
      handleGetAdminReportStats(),
      handleGetAdminReports({ page: 1, size: 200 }),
    ]);

    const totalUsers = usersRes.success
      ? Number((usersRes.pagination as { totalUsers?: number } | undefined)?.totalUsers || 0)
      : 0;

    const postsPagination = (postsRes.pagination as { total?: number; totalPosts?: number } | undefined) || {};
    const totalPosts = postsRes.success ? Number(postsPagination.totalPosts || postsPagination.total || 0) : 0;

    const reportStats = (reportStatsRes.data as Record<string, number> | undefined) || {};
    const totalReports = reportStatsRes.success ? Number(reportStats.total || 0) : 0;
    const pendingReports = reportStatsRes.success ? Number(reportStats.pending || 0) : 0;

    const posts = (postsRes.data as AdminPost[] | undefined) || [];
    const recentAuthorIds = new Set(
      posts
        .map((post) => {
          if (!post.authorId) return "";
          if (typeof post.authorId === "string") return post.authorId;
          return post.authorId._id || "";
        })
        .filter(Boolean)
    );

    const totalLikes = posts.reduce((sum, post) => sum + (Array.isArray(post.likes) ? post.likes.length : 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + Number(post.commentsCount || 0), 0);
    const interactions = totalLikes + totalComments;
    const avgInteractionPerPost = posts.length > 0 ? Math.round((interactions / posts.length) * 10) / 10 : 0;

    setMetrics([
      { label: "Total Users", value: totalUsers },
      { label: "Total Posts", value: totalPosts },
      { label: "Total Reports", value: totalReports },
      { label: "Pending Reports", value: pendingReports },
      {
        label: "Active Users (Recent)",
        value: recentAuthorIds.size,
        helper: "Unique authors from recent 100 posts",
      },
      {
        label: "User Interactions (Recent)",
        value: interactions,
        helper: `Avg ${avgInteractionPerPost} per post`,
      },
    ]);

    const reports = (reportsRes.data as AdminReport[] | undefined) || [];
    const last7Days = pastDays(7);
    const dayMap = new Map<string, number>(last7Days.map((d) => [d.toISOString().slice(0, 10), 0]));

    reports.forEach((report) => {
      if (!report.createdAt) return;
      const key = new Date(report.createdAt).toISOString().slice(0, 10);
      if (dayMap.has(key)) dayMap.set(key, Number(dayMap.get(key) || 0) + 1);
    });

    setTrend(
      Array.from(dayMap.entries()).map(([date, count]) => ({
        date,
        count,
      }))
    );

    const reasonMap = new Map<string, number>();
    reports.forEach((report) => {
      const reason = (report.reasonType || "other").toLowerCase();
      reasonMap.set(reason, Number(reasonMap.get(reason) || 0) + 1);
    });

    setReasonBreakdown(
      Array.from(reasonMap.entries())
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    );

    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOverview();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader onRefresh={() => void loadOverview()} />
      <MetricsGrid loading={loading} metrics={metrics} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReportTrendCard trend={trend} />
        <TopReasonsBarCard loading={loading} reasons={reasonBreakdown} />
      </div>
    </div>
  );
}

