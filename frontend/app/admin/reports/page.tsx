"use client";

import AssignReportModal from "./_components/AssignReportModal";
import ReportDetailsModal from "./_components/ReportDetailsModal";
import ReportFiltersPanel from "./_components/ReportFilters";
import ReportsTable from "./_components/ReportsTable";
import ResolveReportModal from "./_components/ResolveReportModal";
import StatsGrid from "./_components/StatsGrid";
import TargetPreviewModal from "./_components/TargetPreviewModal";
import { DEFAULT_RESOLVE_FORM, getUserRefId } from "./_components/types";
import { useReportsPage } from "./_components/useReportsPage";

export default function AdminReportsPage() {
  const reportPage = useReportsPage();

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden p-4 pr-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <button
          onClick={reportPage.onRefresh}
          className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      <StatsGrid stats={reportPage.stats} />

      <ReportFiltersPanel filters={reportPage.filters} onChange={reportPage.setFilters} />

      <div className="min-h-0 flex-1">
        <ReportsTable
          loading={reportPage.loading}
          reports={reportPage.visibleReports}
          busyId={reportPage.busyId}
          userStatusById={reportPage.userStatusById}
          postPreviewById={reportPage.postPreviewById}
          buildPostMediaUrl={reportPage.buildPostMediaUrl}
          onOpenDetails={(id) => void reportPage.openViewReport(id)}
          onOpenTarget={(report) => void reportPage.openTarget(report)}
          onOpenAssign={(report) => {
            reportPage.setAssigningReportId(report._id);
            reportPage.setAssignToInput(getUserRefId(report.assignedTo));
          }}
          onOpenResolve={(report) => {
            reportPage.setResolveReportId(report._id);
            reportPage.setResolveForm(DEFAULT_RESOLVE_FORM);
          }}
          onQuickUserStatusUpdate={(report, action) => void reportPage.onQuickUserStatusUpdate(report, action)}
          onDeleteUser={(report) => void reportPage.onDeleteUser(report)}
          onDeletePost={(report) => void reportPage.onDeletePost(report)}
          onDeleteCommunity={(report) => void reportPage.onDeleteCommunity(report)}
        />
      </div>

      <ReportDetailsModal
        open={Boolean(reportPage.viewReportId || reportPage.viewReportLoading)}
        loading={reportPage.viewReportLoading}
        report={reportPage.viewReportData}
        onClose={() => {
          reportPage.setViewReportId(null);
          reportPage.setViewReportData(null);
        }}
      />

      <TargetPreviewModal
        open={Boolean(reportPage.targetPreview || reportPage.targetPreviewLoading)}
        loading={reportPage.targetPreviewLoading}
        preview={reportPage.targetPreview}
        onClose={() => reportPage.setTargetPreview(null)}
      />

      <AssignReportModal
        open={Boolean(reportPage.assigningReportId)}
        assignToInput={reportPage.assignToInput}
        setAssignToInput={reportPage.setAssignToInput}
        onClose={() => reportPage.setAssigningReportId(null)}
        onAssign={() => void reportPage.onAssign()}
      />

      <ResolveReportModal
        open={Boolean(reportPage.resolveReportId && reportPage.selectedReport)}
        selectedReport={reportPage.selectedReport}
        resolveForm={reportPage.resolveForm}
        setResolveForm={reportPage.setResolveForm}
        actionOptions={reportPage.resolveActionOptions}
        showSuspensionDays={reportPage.showSuspensionDays}
        onClose={() => reportPage.setResolveReportId(null)}
        onSubmit={() => void reportPage.onResolve()}
      />
    </div>
  );
}
