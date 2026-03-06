import type {
  ReportPriority,
  ReportReasonType,
  ReportStatus,
  ResolveReportPayload,
} from "@/lib/api/admin/report";

export type ReportUserRef = string | { _id?: string; username?: string; email?: string };
export type ReportTargetType = "user" | "post" | "comment" | "message" | "community" | string;

export type ReportItem = {
  _id: string;
  targetType?: ReportTargetType;
  targetId?: string;
  reasonType?: ReportReasonType;
  reasonText?: string;
  evidenceUrls?: string[];
  priority?: ReportPriority;
  status?: ReportStatus;
  actionTaken?: string;
  resolutionNote?: string;
  resolvedAt?: string;
  assignedTo?: ReportUserRef;
  reporterId?: ReportUserRef;
  createdAt?: string;
  updatedAt?: string;
};

export type Pagination = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export type ReportStats = {
  total?: number;
  pending?: number;
  inReview?: number;
  resolved?: number;
  rejected?: number;
  escalated?: number;
};

export type TargetPreview =
  | { kind: "user"; data: Record<string, unknown> }
  | { kind: "post"; data: Record<string, unknown> }
  | { kind: "community"; data: Record<string, unknown> };

export type UserAccountStatus = "active" | "suspended" | "banned" | "deleted" | "unknown";

export type PostPreview = {
  caption: string;
  mediaUrl: string;
  mediaType: string;
  deleted: boolean;
};

export type ReportFilters = {
  status: ReportStatus | "";
  targetType: ReportTargetType | "";
  assignedTo: string;
};

export const DEFAULT_RESOLVE_FORM: ResolveReportPayload = {
  status: "resolved",
  actionTaken: "none",
  resolutionNote: "",
  suspensionDays: 7,
};

export const getUserRefId = (userRef?: ReportUserRef) =>
  typeof userRef === "string" ? userRef : userRef?._id || "";

export const getUserRefLabel = (userRef?: ReportUserRef) => {
  if (!userRef) return "-";
  if (typeof userRef === "string") return userRef;
  return userRef.username || userRef.email || userRef._id || "-";
};

export const formatEnumLabel = (value: string) => value.replaceAll("_", " ");

export const getUserAccountStatus = (data: Record<string, unknown>): UserAccountStatus => {
  const status = String(data.accountStatus || data.status || "").toLowerCase();
  if (status.includes("ban")) return "banned";
  if (status.includes("suspend")) return "suspended";
  if (status.includes("active")) return "active";
  return "unknown";
};
