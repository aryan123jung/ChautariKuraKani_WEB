import type { ReportItem } from "./types";
import { getUserRefLabel } from "./types";
import InfoItem from "./InfoItem";

type Props = {
  open: boolean;
  loading: boolean;
  report: ReportItem | null;
  onClose: () => void;
};

export default function ReportDetailsModal({ open, loading, report, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Report Details</h2>
            <p className="text-xs text-slate-500">Inspect report metadata and evidence URLs</p>
          </div>
          <button onClick={onClose} className="rounded border px-2 py-1 text-xs">
            Close
          </button>
        </div>

        {loading && <div className="py-6 text-center text-sm text-slate-500">Loading report details...</div>}

        {!loading && report && (
          <div className="space-y-3 text-sm">
            <div className="grid gap-2 md:grid-cols-2">
              <InfoItem label="Report ID" value={report._id} />
              <InfoItem label="Target Type" value={report.targetType || "-"} />
              <InfoItem label="Target ID" value={report.targetId || "-"} />
              <InfoItem label="Reporter" value={getUserRefLabel(report.reporterId)} />
              <InfoItem label="Assigned" value={getUserRefLabel(report.assignedTo)} />
              <InfoItem label="Status" value={report.status || "-"} />
              <InfoItem label="Action Taken" value={report.actionTaken || "-"} />
              <InfoItem label="Priority" value={report.priority || "-"} />
              <InfoItem
                label="Created"
                value={report.createdAt ? new Date(report.createdAt).toLocaleString() : "-"}
              />
              <InfoItem
                label="Resolved"
                value={report.resolvedAt ? new Date(report.resolvedAt).toLocaleString() : "-"}
              />
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">Reason</p>
              <div className="rounded border bg-slate-50 p-2">
                <p className="font-medium">{report.reasonType || "-"}</p>
                <p className="mt-1 text-slate-600">{report.reasonText || "-"}</p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">Resolution Note</p>
              <div className="rounded border bg-slate-50 p-2 text-slate-700">
                {report.resolutionNote || "No resolution note"}
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">Evidence URLs</p>
              {Array.isArray(report.evidenceUrls) && (report.evidenceUrls?.length || 0) > 0 ? (
                <div className="space-y-1 rounded border bg-slate-50 p-2">
                  {report.evidenceUrls?.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-blue-600 underline"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded border bg-slate-50 p-2 text-slate-500">No evidence urls</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
