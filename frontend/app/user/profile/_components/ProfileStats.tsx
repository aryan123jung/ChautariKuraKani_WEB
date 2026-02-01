function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export default function ProfileStats({ user }: { user: any }) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <InfoCard label="Role" value={user.role} />
      <InfoCard
        label="Joined"
        value={new Date(user.createdAt).toDateString()}
      />
      <InfoCard
        label="Updated"
        value={new Date(user.updatedAt).toDateString()}
      />
    </div>
  );
}
