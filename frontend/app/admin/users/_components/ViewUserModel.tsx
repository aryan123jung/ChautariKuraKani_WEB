
"use client";

import Image from "next/image";
import { AdminUser } from "../page";

export default function ViewUserModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
//   onSuccess: ()=> void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-md shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">User Profile</h2>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative flex items-center justify-center">
              {user.profileUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${user.profileUrl}`}
                  alt={`${user.firstName} profile`}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-600">
                  {user.firstName?.[0]}
                </span>
              )}
            </div>

            {/* User info */}
            <div>
              <p className="font-semibold text-lg">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}