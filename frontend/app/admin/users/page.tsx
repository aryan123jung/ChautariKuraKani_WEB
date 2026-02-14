
// "use client";

// import { useEffect, useState } from "react";
// import UsersTable from "./_components/UsersTable";
// import CreateUserModal from "./_components/CreateUserModal";
// import ViewUserModal from "./_components/ViewUserModel";
// import UpdateUserForm from "./_components/UpdateUserForm";
// import { handleGetAllUsers, handleDeleteUser } from "@/lib/actions/admin/user-action";
// import { toast } from "react-toastify";
// import DeleteModal from "@/app/_components/DeleteModal";
// import UpdateUserModal from "./_components/UpdateUserModal";

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

//   const [editUser, setEditUser] = useState<AdminUser | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const loadUsers = async () => {
//     const res = await handleGetAllUsers();
//     setUsers(res);
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

  
//   const handleDeleteClick = (user: AdminUser) => {
//     setDeleteUser(user);
//     setIsDeleteModalOpen(true);
//   };

  
//   const handleDeleteConfirm = async () => {
//     if (!deleteUser) return;

//     const res = await handleDeleteUser(deleteUser._id);

//     if (res.success) {
//       toast.success(res.message);
//       loadUsers();
//     } else {
//       toast.error(res.message);
//     }

//     setIsDeleteModalOpen(false);
//     setDeleteUser(null);
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Users</h1>

//         <button
//           onClick={() => setOpenCreate(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           + Create User
//         </button>
//       </div>

//       {/* Users Table */}
//       <UsersTable
//         users={users}
//         onView={(u) => setViewUser(u)}
//         onEdit={(u) => {
//           setEditUser(u);
//           setIsEditModalOpen(true);
//         }}
//         onDelete={handleDeleteClick}
//       />

//       {/* Create User Modal */}
//       {openCreate && (
//         <CreateUserModal
//           onClose={() => setOpenCreate(false)}
//           onSuccess={() => {
//             setOpenCreate(false);
//             loadUsers();
//           }}
//         />
//       )}

//       {/* View User Modal */}
//       {viewUser && (
//         <ViewUserModal
//           user={viewUser}
//           onClose={() => setViewUser(null)}
//         />
//       )}

//       {/* Edit Modal */}
//       {/* {isEditModalOpen && editUser && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-xl p-6 rounded-lg border border-white relative">
//             <button
//               onClick={() => {
//                 setIsEditModalOpen(false);
//                 setEditUser(null);
//               }}
//               className="absolute top-3 right-3 text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>

//             <UpdateUserForm
//               user={editUser}
//               onSuccess={() => {
//                 setIsEditModalOpen(false);
//                 setEditUser(null);
//                 loadUsers(); 
//               }}
//             />
//           </div>
//         </div>
//       )} */}
//       {/* Edit User Modal */}
//       {isEditModalOpen && editUser && (
//         <UpdateUserModal
//           user={editUser}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setEditUser(null);
//           }}
//           onSuccess={() => {
//             setIsEditModalOpen(false);
//             setEditUser(null);
//             loadUsers();
//           }}
//         />
//       )}



//       {/* Delete Modal */}
//       <DeleteModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => {
//           setIsDeleteModalOpen(false);
//           setDeleteUser(null);
//         }}
//         onConfirm={handleDeleteConfirm}
//         title="Delete User"
//         description={`Are you sure you want to delete ${deleteUser?.role} @${
//           deleteUser?.username
//         }?`}
//       />
//     </div>
//   );
// }













"use client";

import { useEffect, useState } from "react";
import UsersTable from "./_components/UsersTable";
import CreateUserModal from "./_components/CreateUserModal";
import ViewUserModal from "./_components/ViewUserModel";
import { handleGetAllUsers, handleDeleteUser } from "@/lib/actions/admin/user-action";
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
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    size: 6,
    totalUsers: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 🔥 Load Users
  const loadUsers = async (
    page = pagination.page,
    size = pagination.size,
    searchValue = search
  ) => {
    try {
      setLoading(true);

      const res = await handleGetAllUsers(
        String(page),
        String(size),
        searchValue
      );

      if (res.success) {
        setUsers(res.data);
        setPagination(res.pagination);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadUsers(1);
  }, []);

  // 🔍 Debounced Search
  useEffect(() => {
    const delay = setTimeout(() => {
      loadUsers(1, pagination.size, search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // 🗑 Delete
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
    <div className="space-y-6 p-4 ">

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

      {/* 🔍 Search + Total */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          className="border p-2 rounded w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="text-sm text-gray-500">
          Total Users: {pagination.totalUsers}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : (
        <UsersTable
          users={users}
          onView={(u) => setViewUser(u)}
          onEdit={(u) => {
            setEditUser(u);
            setIsEditModalOpen(true);
          }}
          onDelete={(u) => {
            setDeleteUser(u);
            setIsDeleteModalOpen(true);
          }}
        />
      )}

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-3">

        <button
          disabled={pagination.page === 1}
          onClick={() => loadUsers(pagination.page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => loadUsers(pagination.page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <CreateUserModal
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            loadUsers();
          }}
        />
      )}

      {/* View Modal */}
      {viewUser && (
        <ViewUserModal
          user={viewUser}
          onClose={() => setViewUser(null)}
        />
      )}

      {/* Edit Modal */}
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
        description={`Are you sure you want to delete @${
          deleteUser?.username
        }?`}
      />
    </div>
  );
}
