import type { ReportStats } from "./types";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function StatsGrid({ stats }: { stats: ReportStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
      <StatCard label="Total" value={stats.total ?? 0} />
      <StatCard label="Pending" value={stats.pending ?? 0} />
      <StatCard label="In Review" value={stats.inReview ?? 0} />
      <StatCard label="Resolved" value={stats.resolved ?? 0} />
      <StatCard label="Rejected" value={stats.rejected ?? 0} />
      <StatCard label="Escalated" value={stats.escalated ?? 0} />
    </div>
  );
}
