// "use client";

// import { AdminUser } from "../page";

// export default function UsersTable({ users }: { users: AdminUser[] }) {
//   return (
//     <div className="bg-white rounded-md shadow overflow-x-auto">
//       <table className="w-full">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3">Name</th>
//             <th className="p-3">Email</th>
//             <th className="p-3">Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => (
//             <tr key={u._id} className="border-t">
//               <td className="p-3">
//                 {u.firstName} {u.lastName}
//               </td>
//               <td className="p-3">{u.email}</td>
//               <td className="p-3 capitalize">{u.role}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import { AdminUser } from "../page";
import { Pencil, Trash2, Eye } from "lucide-react";

export default function UsersTable({
  users,
  onView,
  onEdit,
  onDelete,
}: {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t hover:bg-gray-50">
              {/* Profile */}
              <td className="p-3 flex items-center gap-3">
                {/* <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="font-semibold text-gray-600">
                    {u.firstName[0]}
                  </span>
                </div> */}
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                  {u.profileUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${u.profileUrl}`}
                      alt={`${u.firstName} profile`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-semibold text-gray-600">
                      {u.firstName?.[0]}
                    </span>
                  )}
                </div>

                <div>
                  <p className="font-medium">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-gray-500">@{u.username}</p>
                </div>
              </td>

              <td className="p-3">{u.email}</td>

              <td className="p-3 capitalize">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.role}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(u)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => onEdit(u)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(u)}
                    className="p-2 rounded hover:bg-red-100 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
