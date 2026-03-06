import type { TrendPoint } from "./types";

const dayLabel = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });

type Props = {
  trend: TrendPoint[];
};

export default function ReportTrendCard({ trend }: Props) {
  const maxTrend = Math.max(...trend.map((item) => item.count), 1);

  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Report Trend (Last 7 Days)</h2>
      <p className="text-xs text-slate-500">Based on latest fetched reports</p>
      <div className="mt-4 space-y-2">
        {trend.map((point) => (
          <div key={point.date} className="grid grid-cols-[72px_1fr_36px] items-center gap-2">
            <span className="text-xs text-slate-600">{dayLabel(point.date)}</span>
            <div className="h-2 rounded bg-slate-100">
              <div
                className="h-2 rounded bg-green-600"
                style={{ width: `${Math.max((point.count / maxTrend) * 100, point.count ? 8 : 0)}%` }}
              />
            </div>
            <span className="text-right text-xs font-medium text-slate-700">{point.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

