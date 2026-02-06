
// "use client";

// import { useEffect, useState } from "react";
// import UsersTable from "./_components/UsersTable";
// import CreateUserModal from "./_components/CreateUserModal";

// import { getUsers, handleDeleteUser } from "@/lib/actions/admin/user-action";
// import ViewUserModal from "./_components/ViewUserModel";
// import { toast } from "react-toastify";

// export type AdminUser = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   username: string;
//   profileUrl?: string;
//   role: "user" | "admin";
// };

// export default function UsersPage() {
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [openCreate, setOpenCreate] = useState(false);
//   const [viewUser, setViewUser] = useState<AdminUser | null>(null);

//   const loadUsers = async () => {
//     const res = await getUsers();
//     setUsers(res);
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);



//   const handleDelete = async (user: AdminUser) => {
//   if (!confirm(`Are you sure you want to delete ${user.firstName}?`)) return;

//   const res = await handleDeleteUser(user._id);

//   if (res.success) {
//     toast.success(res.message);
//     loadUsers(); 
//   } else {
//     toast.error(res.message);
//   }
// };

//   return (
//     <div className="space-y-6 p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Users</h1>
//         <button
//           onClick={() => setOpenCreate(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           + Create User
//         </button>
//       </div>


//       {/*view,edit,delete -> User*/}
//       <UsersTable
//         users={users}
//         onView={(u) => setViewUser(u)}
//         onEdit={(u) => console.log("Edit", u)}
//         onDelete={handleDelete}
//       />

//       {/* Create User Modal */}
//       {openCreate && (
//         <CreateUserModal
//           onClose={() => setOpenCreate(false)}
//           onSuccess={loadUsers} 
//         />
//       )}

//       {/* View User Modal */}
//       {viewUser && (
//         <ViewUserModal
//           user={viewUser}
//           onClose={() => setViewUser(null)}
//         />
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import UsersTable from "./_components/UsersTable";
import CreateUserModal from "./_components/CreateUserModal";
import ViewUserModal from "./_components/ViewUserModel";
import { getUsers, handleDeleteUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import DeleteModal from "@/app/_components/DeleteModal";

export type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileUrl?: string;
  role: "user" | "admin";
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null); // track user to delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // When trash icon is clicked
  const handleDeleteClick = (user: AdminUser) => {
    setDeleteUser(user);
    setIsDeleteModalOpen(true);
  };

  // When modal confirm button is clicked
  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;

    const res = await handleDeleteUser(deleteUser._id);
    if (res.success) {
      toast.success(res.message);
      loadUsers(); // refresh table
    } else {
      toast.error(res.message);
    }

    setIsDeleteModalOpen(false);
    setDeleteUser(null);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create User
        </button>
      </div>

      <UsersTable
        users={users}
        onView={(u) => setViewUser(u)}
        onEdit={(u) => console.log("Edit", u)}
        onDelete={handleDeleteClick} 
      />

      {/* Create User Modal */}
      {openCreate && (
        <CreateUserModal onClose={() => setOpenCreate(false)} onSuccess={loadUsers} />
      )}

      {/* View User Modal */}
      {viewUser && <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        // description={`Are you sure you want to delete ${
        //   deleteUser?.firstName
        // } ${deleteUser?.lastName}?`}
        description={`Are you sure you want to delete ${deleteUser?.role} @${
          deleteUser?.username}?`
        }
      />
    </div>
  );
}
