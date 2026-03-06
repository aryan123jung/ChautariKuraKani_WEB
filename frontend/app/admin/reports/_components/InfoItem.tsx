export default function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border bg-slate-50 p-2">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="truncate text-sm text-slate-900">{value}</p>
    </div>
  );
}
