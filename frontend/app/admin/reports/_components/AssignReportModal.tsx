type Props = {
  open: boolean;
  assignToInput: string;
  setAssignToInput: (value: string) => void;
  onClose: () => void;
  onAssign: () => void;
};

export default function AssignReportModal({
  open,
  assignToInput,
  setAssignToInput,
  onClose,
  onAssign,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl">
        <h2 className="text-lg font-semibold">Assign Report</h2>
        <p className="mt-1 text-sm text-slate-600">Enter admin user id to assign this report.</p>
        <input
          value={assignToInput}
          onChange={(event) => setAssignToInput(event.target.value)}
          placeholder="adminUserId"
          className="mt-3 w-full rounded border px-3 py-2 text-sm"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button
            onClick={onAssign}
            className="rounded bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
