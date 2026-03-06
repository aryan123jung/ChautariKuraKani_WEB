import type { ActionTaken, ReportStatus } from "@/lib/api/admin/report";
import type { ReportTargetType } from "./types";

export const statusOptions: Array<ReportStatus | ""> = [
  "",
  "pending",
  "in_review",
  "resolved",
  "rejected",
  "escalated",
];

export const targetTypeOptions: Array<ReportTargetType | ""> = [
  "",
  "user",
  "post",
  "comment",
  "message",
  "community",
];

export const actionOptionsUser: ActionTaken[] = ["none", "suspend", "ban"];
export const actionOptionsContent: ActionTaken[] = ["none", "delete"];

export const resolveStatusOptions: ReportStatus[] = [
  "resolved",
  "rejected",
  "in_review",
  "pending",
  "escalated",
];
