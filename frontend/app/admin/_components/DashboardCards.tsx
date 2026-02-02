export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="font-semibold mb-2">Recent Users</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Laxman Shrestha</li>
          <li>Ram Sharma</li>
          <li>Dilip Pandey</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="font-semibold mb-2">System Status</h2>
        <p className="text-green-600">All systems operational ✅</p>
      </div>
    </div>
  );
}
