"use client";

import { useEffect, useState } from "react";
import UsersTable from "./_components/UsersTable";
import CreateUserModal from "./_components/CreateUserModal";
import { getUsers } from "@/lib/actions/admin/user-action";

export type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "user" | "admin";
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [open, setOpen] = useState(false);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create User
        </button>
      </div>

      <UsersTable users={users} />

      {open && (
        <CreateUserModal
          onClose={() => setOpen(false)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}
