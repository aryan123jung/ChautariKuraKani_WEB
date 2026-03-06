import type { Pagination } from "./types";

export default function PaginationBar({
  pagination,
  onPrev,
  onNext,
}: {
  pagination: Pagination;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        disabled={pagination.page <= 1}
        onClick={onPrev}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-sm text-slate-600">
        Page {pagination.page} of {pagination.totalPages || 1}
      </span>
      <button
        disabled={pagination.page >= (pagination.totalPages || 1)}
        onClick={onNext}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
