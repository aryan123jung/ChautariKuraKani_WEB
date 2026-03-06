import type { ReasonPoint } from "./types";

type Props = {
  loading: boolean;
  reasons: ReasonPoint[];
};

export default function TopReasonsBarCard({ loading, reasons }: Props) {
  const maxReason = Math.max(...reasons.map((item) => item.count), 1);

  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Top Report Reasons</h2>
      <p className="text-xs text-slate-500">Most frequent recent moderation reasons</p>
      <div className="mt-3 space-y-2">
        {reasons.length === 0 && (
          <p className="text-sm text-slate-500">{loading ? "Loading..." : "No report data available"}</p>
        )}
        {reasons.map((item) => (
          <div key={item.reason} className="rounded border bg-slate-50 px-3 py-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm capitalize text-slate-700">{item.reason}</span>
              <span className="text-xs font-semibold text-slate-700">{item.count}</span>
            </div>
            <div className="h-2 rounded bg-slate-200">
              <div
                className="h-2 rounded bg-emerald-600"
                style={{ width: `${Math.max((item.count / maxReason) * 100, item.count ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

