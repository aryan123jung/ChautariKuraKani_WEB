import type { ReportItem, UserAccountStatus, PostPreview } from "./types";
import { getUserRefLabel } from "./types";

type Props = {
  loading: boolean;
  reports: ReportItem[];
  busyId: string | null;
  userStatusById: Record<string, UserAccountStatus>;
  postPreviewById: Record<string, PostPreview>;
  buildPostMediaUrl: (mediaUrl: string, mediaType: string) => string;
  onOpenDetails: (reportId: string) => void;
  onOpenTarget: (report: ReportItem) => void;
  onOpenAssign: (report: ReportItem) => void;
  onOpenResolve: (report: ReportItem) => void;
  onQuickUserStatusUpdate: (
    report: ReportItem,
    action: "suspend" | "unsuspend" | "ban" | "unban"
  ) => void;
  onDeleteUser: (report: ReportItem) => void;
  onDeletePost: (report: ReportItem) => void;
  onDeleteCommunity: (report: ReportItem) => void;
};

export default function ReportsTable({
  loading,
  reports,
  busyId,
  userStatusById,
  postPreviewById,
  buildPostMediaUrl,
  onOpenDetails,
  onOpenTarget,
  onOpenAssign,
  onOpenResolve,
  onQuickUserStatusUpdate,
  onDeleteUser,
  onDeletePost,
  onDeleteCommunity,
}: Props) {
  const getTargetLabel = (targetType?: string) => {
    if (targetType === "community") return "CHAUTARI";
    if (targetType === "user") return "USER";
    if (targetType === "post") return "POST";
    return (targetType || "-").toUpperCase();
  };

  return (
    <div className="h-full min-h-0 overflow-hidden rounded-lg border bg-white">
      <div className="scrollbar-none h-full min-h-0 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50 text-left">
          <tr>
            <th className="px-3 py-2">Target</th>
            <th className="px-3 py-2">Reason</th>
            <th className="px-3 py-2">Priority</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Admin Action</th>
            <th className="px-3 py-2">Assigned</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={8} className="px-3 py-5 text-center text-slate-500">
                Loading reports...
              </td>
            </tr>
          )}

          {!loading && reports.length === 0 && (
            <tr>
              <td colSpan={8} className="px-3 py-5 text-center text-slate-500">
                No reports found
              </td>
            </tr>
          )}

          {!loading &&
            reports.map((report) => {
              const targetId = report.targetId ?? "";
              const userStatus = targetId ? userStatusById[targetId] : "unknown";
              const postPreview = targetId ? postPreviewById[targetId] : undefined;

              return (
                <tr key={report._id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="font-medium">{getTargetLabel(report.targetType)}</div>
                    <div className="text-xs text-slate-500">{targetId || "-"}</div>
                    {report.targetType === "post" && postPreview?.deleted && (
                      <span className="mt-1 inline-block rounded bg-red-100 px-2 py-0.5 text-[11px] font-medium uppercase text-red-700">
                        Deleted
                      </span>
                    )}
                    {report.targetType === "community" &&
                      report.status &&
                      ["resolved", "rejected"].includes(report.status) &&
                      report.actionTaken === "delete" && (
                        <span className="mt-1 inline-block rounded bg-red-100 px-2 py-0.5 text-[11px] font-medium uppercase text-red-700">
                          Deleted
                        </span>
                      )}
                    {report.targetType === "post" && targetId && (
                      <div className="mt-2 max-w-xs space-y-1">
                        <p className="truncate text-xs text-slate-700">{postPreview?.caption || "No caption"}</p>
                        {postPreview?.mediaUrl && postPreview?.mediaType === "image" && (
                          <img
                            src={buildPostMediaUrl(postPreview.mediaUrl, postPreview.mediaType)}
                            alt="Reported post"
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div>{report.reasonType || "-"}</div>
                    <div className="max-w-xs truncate text-xs text-slate-500">{report.reasonText || "-"}</div>
                  </td>
                  <td className="px-3 py-2 uppercase">{report.priority || "-"}</td>
                  <td className="px-3 py-2 uppercase">{report.status || "-"}</td>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <div className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-700">
                        {report.actionTaken || "none"}
                      </div>
                      {report.resolvedAt && (
                        <div className="text-xs text-slate-500">
                          {new Date(report.resolvedAt).toLocaleString()}
                        </div>
                      )}
                      {report.resolutionNote && (
                        <p className="max-w-xs truncate text-xs text-slate-600">{report.resolutionNote}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">{getUserRefLabel(report.assignedTo)}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {report.createdAt ? new Date(report.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        disabled={busyId === report._id}
                        onClick={() => onOpenDetails(report._id)}
                        className="rounded border px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-60"
                      >
                        Details
                      </button>
                      <button
                        disabled={busyId === report._id}
                        onClick={() => onOpenTarget(report)}
                        className="rounded border px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-60"
                      >
                        Target
                      </button>
                      <button
                        disabled={busyId === report._id}
                        onClick={() => onOpenAssign(report)}
                        className="rounded border px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-60"
                      >
                        Assign Admin
                      </button>
                      <button
                        disabled={busyId === report._id}
                        onClick={() => onOpenResolve(report)}
                        className="rounded border border-green-600 px-2 py-1 text-xs text-green-700 hover:bg-green-50 disabled:opacity-60"
                      >
                        Update
                      </button>

                      {report.targetType === "user" && targetId && (
                        <>
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs uppercase text-slate-600">
                            {userStatus || "unknown"}
                          </span>
                          <button
                            disabled={busyId === report._id}
                            onClick={() =>
                              onQuickUserStatusUpdate(
                                report,
                                userStatus === "suspended" ? "unsuspend" : "suspend"
                              )
                            }
                            className="rounded border border-amber-500 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                          >
                            {userStatus === "suspended" ? "Unsuspend" : "Suspend"}
                          </button>
                          <button
                            disabled={busyId === report._id || userStatus === "deleted"}
                            onClick={() =>
                              onQuickUserStatusUpdate(
                                report,
                                userStatus === "banned" ? "unban" : "ban"
                              )
                            }
                            className="rounded border border-red-500 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                          >
                            {userStatus === "banned" ? "Unban" : "Ban"}
                          </button>
                          <button
                            disabled={busyId === report._id || userStatus === "deleted"}
                            onClick={() => onDeleteUser(report)}
                            className="rounded border border-red-700 px-2 py-1 text-xs text-red-800 hover:bg-red-100 disabled:opacity-60"
                          >
                            Delete User
                          </button>
                        </>
                      )}

                      {report.targetType === "post" && targetId && (
                        <button
                          disabled={busyId === report._id}
                          onClick={() => onDeletePost(report)}
                          className="rounded border border-red-500 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete Post
                        </button>
                      )}

                      {report.targetType === "community" && targetId && (
                        <button
                          disabled={busyId === report._id}
                          onClick={() => onDeleteCommunity(report)}
                          className="rounded border border-red-500 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete Chautari
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
