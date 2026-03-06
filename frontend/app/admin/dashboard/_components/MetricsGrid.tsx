import type { DashboardMetric } from "./types";

type Props = {
  loading: boolean;
  metrics: DashboardMetric[];
};

export default function MetricsGrid({ loading, metrics }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border bg-white p-4">
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{loading ? "-" : metric.value}</p>
          {metric.helper && <p className="mt-1 text-xs text-slate-500">{metric.helper}</p>}
        </div>
      ))}
    </div>
  );
}

