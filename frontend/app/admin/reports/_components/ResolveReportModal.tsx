import type { ActionTaken, ResolveReportPayload } from "@/lib/api/admin/report";
import { resolveStatusOptions } from "./constants";
import { formatEnumLabel } from "./types";
import type { ReportItem } from "./types";

type Props = {
  open: boolean;
  selectedReport: ReportItem | null;
  resolveForm: ResolveReportPayload;
  setResolveForm: (updater: (prev: ResolveReportPayload) => ResolveReportPayload) => void;
  actionOptions: ActionTaken[];
  showSuspensionDays: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function ResolveReportModal({
  open,
  selectedReport,
  resolveForm,
  setResolveForm,
  actionOptions,
  showSuspensionDays,
  onClose,
  onSubmit,
}: Props) {
  if (!open || !selectedReport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow-xl">
        <h2 className="text-lg font-semibold">Resolve Report</h2>
        <p className="mt-1 text-sm text-slate-600">
          Report: {selectedReport._id} ({selectedReport.targetType || "-"})
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              value={resolveForm.status}
              onChange={(event) =>
                setResolveForm((prev) => ({
                  ...prev,
                  status: event.target.value as ResolveReportPayload["status"],
                }))
              }
              className="w-full rounded border px-3 py-2 text-sm"
            >
              {resolveStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatEnumLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Action Taken</label>
            <select
              value={resolveForm.actionTaken}
              onChange={(event) =>
                setResolveForm((prev) => ({
                  ...prev,
                  actionTaken: event.target.value as ActionTaken,
                }))
              }
              className="w-full rounded border px-3 py-2 text-sm"
            >
              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {formatEnumLabel(action)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showSuspensionDays && (
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">Suspension Days</label>
            <input
              type="number"
              min={1}
              value={resolveForm.suspensionDays ?? 7}
              onChange={(event) =>
                setResolveForm((prev) => ({
                  ...prev,
                  suspensionDays: Number(event.target.value || 0),
                }))
              }
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>
        )}

        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium">Resolution Note</label>
          <textarea
            value={resolveForm.resolutionNote || ""}
            onChange={(event) =>
              setResolveForm((prev) => ({ ...prev, resolutionNote: event.target.value }))
            }
            rows={3}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Resolution details"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
