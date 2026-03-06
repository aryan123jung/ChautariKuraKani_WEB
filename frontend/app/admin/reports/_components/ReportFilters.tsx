import type { ReportStatus } from "@/lib/api/admin/report";
import { statusOptions, targetTypeOptions } from "./constants";
import type { ReportFilters, ReportTargetType } from "./types";

type Props = {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
};

export default function ReportFiltersPanel({ filters, onChange }: Props) {
  return (
    <div className="grid gap-2 rounded-lg border bg-white p-3 md:grid-cols-4">
      <select
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as ReportStatus | "" })
        }
        className="rounded border px-3 py-2 text-sm"
      >
        {statusOptions.map((option) => (
          <option key={option || "all"} value={option}>
            {option || "All Status"}
          </option>
        ))}
      </select>

      <select
        value={filters.targetType}
        onChange={(event) =>
          onChange({
            ...filters,
            targetType: event.target.value as ReportTargetType | "",
          })
        }
        className="rounded border px-3 py-2 text-sm"
      >
        {targetTypeOptions.map((option) => (
          <option key={option || "all"} value={option}>
            {option || "All Targets"}
          </option>
        ))}
      </select>

      <input
        value={filters.assignedTo}
        onChange={(event) => onChange({ ...filters, assignedTo: event.target.value })}
        placeholder="Assigned admin id (optional)"
        className="rounded border px-3 py-2 text-sm"
      />

      <button
        onClick={() =>
          onChange({
            status: "",
            targetType: "",
            assignedTo: "",
          })
        }
        className="rounded border px-3 py-2 text-sm hover:bg-slate-50"
      >
        Clear Filters
      </button>
    </div>
  );
}
