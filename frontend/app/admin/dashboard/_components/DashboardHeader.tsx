type Props = {
  onRefresh: () => void;
};

export default function DashboardHeader({ onRefresh }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      <button
        onClick={onRefresh}
        className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
      >
        Refresh
      </button>
    </div>
  );
}

