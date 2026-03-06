import { ReportService } from "../services/report.services";

const reportService = new ReportService();

export const startReportAutoResolveJob = () => {
  const enabled = (process.env.REPORT_AUTO_RESOLVE_ENABLED ?? "true").toLowerCase() !== "false";
  if (!enabled) return;

  const everyMinutes = Math.max(
    1,
    parseInt(process.env.REPORT_AUTO_RESOLVE_INTERVAL_MINUTES || "10", 10)
  );
  const intervalMs = everyMinutes * 60 * 1000;

  let isRunning = false;

  setInterval(async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      const result = await reportService.autoResolveOrphanedPendingReports();
      if (result.resolved > 0) {
        console.log(
          `[report-auto-resolve] checked=${result.checked} resolved=${result.resolved}`
        );
      }
    } catch (error) {
      console.error("[report-auto-resolve] failed", error);
    } finally {
      isRunning = false;
    }
  }, intervalMs);
};

