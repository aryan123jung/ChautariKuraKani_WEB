"use client";

import Link from "next/link";

export default function ProfileDetails({ user }: { user: any }) {
  return (
    <div className="mt-20 flex flex-col md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-gray-500">@{user.username}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      <Link
        href="/user/profile/edit"
        className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
      >
        Edit Profile
      </Link>
    </div>
  );
}
