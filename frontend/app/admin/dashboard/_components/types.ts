export type DashboardMetric = {
  label: string;
  value: number;
  helper?: string;
};

export type TrendPoint = {
  date: string;
  count: number;
};

export type ReasonPoint = {
  reason: string;
  count: number;
};

export type AdminPost = {
  _id?: string;
  createdAt?: string;
  likes?: unknown[];
  commentsCount?: number;
  authorId?: string | { _id?: string };
};

export type AdminReport = {
  _id?: string;
  createdAt?: string;
  reasonType?: string;
};

