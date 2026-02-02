"use client";

export default function AdminTopbar() {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">Dashboard</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Admin</span>
        <div className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full">
          A
        </div>
      </div>
    </header>
  );
}
