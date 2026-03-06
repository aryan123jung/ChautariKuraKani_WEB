"use client";

import { useMemo, useState } from "react";
import type {
  CreateReportPayload,
  ReportPriority,
  ReportReasonType,
} from "@/lib/api/report";

const reasonOptions: Array<{ value: ReportReasonType; label: string }> = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "hate", label: "Hate" },
  { value: "violence", label: "Violence" },
  { value: "nudity", label: "Nudity" },
  { value: "scam", label: "Scam" },
  { value: "misinformation", label: "Misinformation" },
  { value: "impersonation", label: "Impersonation" },
  { value: "other", label: "Other" },
];

const priorityOptions: Array<{ value: ReportPriority; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  targetLabel: string;
  onSubmit: (payload: CreateReportPayload) => Promise<void> | void;
  isSubmitting?: boolean;
};

export default function ReportModal({
  isOpen,
  onClose,
  targetLabel,
  onSubmit,
  isSubmitting = false,
}: ReportModalProps) {
  const [reasonType, setReasonType] = useState<ReportReasonType>("spam");
  const [priority, setPriority] = useState<ReportPriority>("medium");
  const [reasonText, setReasonText] = useState("");
  const [evidenceInput, setEvidenceInput] = useState("");

  const evidenceUrls = useMemo(
    () =>
      evidenceInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [evidenceInput]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
              Report {targetLabel}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Help moderators review this by adding a reason and optional details.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Reason
              </label>
              <select
                value={reasonType}
                onChange={(event) => setReasonType(event.target.value as ReportReasonType)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
              >
                {reasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as ReportPriority)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                value={reasonText}
                onChange={(event) => setReasonText(event.target.value)}
                placeholder="Add context for moderator review..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Evidence URLs (optional, comma-separated)
              </label>
              <input
                value={evidenceInput}
                onChange={(event) => setEvidenceInput(event.target.value)}
                placeholder="https://example.com/a, https://example.com/b"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                void onSubmit({
                  reasonType,
                  priority,
                  reasonText: reasonText.trim() || undefined,
                  evidenceUrls: evidenceUrls.length ? evidenceUrls : undefined,
                })
              }
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
