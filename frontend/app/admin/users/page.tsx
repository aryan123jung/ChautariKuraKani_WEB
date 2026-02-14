
// "use client";

// import { useEffect, useState } from "react";
// import UsersTable from "./_components/UsersTable";
// import CreateUserModal from "./_components/CreateUserModal";
// import ViewUserModal from "./_components/ViewUserModel";
// import { getUsers, handleDeleteUser } from "@/lib/actions/admin/user-action";
// import { toast } from "react-toastify";
// import DeleteModal from "@/app/_components/DeleteModal";

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
//   const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null); // track user to delete
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const loadUsers = async () => {
//     const res = await getUsers();
//     setUsers(res);
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   // When trash icon is clicked
//   const handleDeleteClick = (user: AdminUser) => {
//     setDeleteUser(user);
//     setIsDeleteModalOpen(true);
//   };

//   // When modal confirm button is clicked
//   const handleDeleteConfirm = async () => {
//     if (!deleteUser) return;

//     const res = await handleDeleteUser(deleteUser._id);
//     if (res.success) {
//       toast.success(res.message);
//       loadUsers(); // refresh table
//     } else {
//       toast.error(res.message);
//     }

//     setIsDeleteModalOpen(false);
//     setDeleteUser(null);
//   };

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

//       <UsersTable
//         users={users}
//         onView={(u) => setViewUser(u)}
//         onEdit={(u) => console.log("Edit", u)}
//         onDelete={handleDeleteClick} 
//       />

//       {/* Create User Modal */}
//       {openCreate && (
//         <CreateUserModal onClose={() => setOpenCreate(false)} onSuccess={loadUsers} />
//       )}

//       {/* View User Modal */}
//       {viewUser && <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />}

//       {/* Delete Modal */}
//       <DeleteModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={handleDeleteConfirm}
//         title="Delete User"
//         // description={`Are you sure you want to delete ${
//         //   deleteUser?.firstName
//         // } ${deleteUser?.lastName}?`}
//         description={`Are you sure you want to delete ${deleteUser?.role} @${
//           deleteUser?.username}?`
//         }
//       />
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import UsersTable from "./_components/UsersTable";
import CreateUserModal from "./_components/CreateUserModal";
import ViewUserModal from "./_components/ViewUserModel";
import UpdateUserForm from "./_components/UpdateUserForm";
import { getUsers, handleDeleteUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import DeleteModal from "@/app/_components/DeleteModal";
import UpdateUserModal from "./_components/UpdateUserModal";

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

  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  
  const handleDeleteClick = (user: AdminUser) => {
    setDeleteUser(user);
    setIsDeleteModalOpen(true);
  };

  
  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;

    const res = await handleDeleteUser(deleteUser._id);

    if (res.success) {
      toast.success(res.message);
      loadUsers();
    } else {
      toast.error(res.message);
    }

    setIsDeleteModalOpen(false);
    setDeleteUser(null);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create User
        </button>
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        onView={(u) => setViewUser(u)}
        onEdit={(u) => {
          setEditUser(u);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteClick}
      />

      {/* Create User Modal */}
      {openCreate && (
        <CreateUserModal
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            loadUsers();
          }}
        />
      )}

      {/* View User Modal */}
      {viewUser && (
        <ViewUserModal
          user={viewUser}
          onClose={() => setViewUser(null)}
        />
      )}

      {/* Edit Modal */}
      {/* {isEditModalOpen && editUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded-lg border border-white relative">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditUser(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <UpdateUserForm
              user={editUser}
              onSuccess={() => {
                setIsEditModalOpen(false);
                setEditUser(null);
                loadUsers(); 
              }}
            />
          </div>
        </div>
      )} */}
      {/* Edit User Modal */}
      {isEditModalOpen && editUser && (
        <UpdateUserModal
          user={editUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditUser(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditUser(null);
            loadUsers();
          }}
        />
      )}



      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteUser?.role} @${
          deleteUser?.username
        }?`}
      />
    </div>
  );
}
