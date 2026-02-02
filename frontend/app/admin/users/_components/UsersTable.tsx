"use client";

import { AdminUser } from "../page";

export default function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-3">
                {u.firstName} {u.lastName}
              </td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 capitalize">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
