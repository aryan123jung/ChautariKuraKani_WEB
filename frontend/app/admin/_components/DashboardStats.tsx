export default function DashboardStats() {
  const stats = [
    { label: "Total Users", value: 124 },
    { label: "Total Posts", value: 456 },
    { label: "Reports", value: 12 },
    { label: "Active Today", value: 38 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-md shadow p-4"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
