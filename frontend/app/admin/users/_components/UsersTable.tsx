
// "use client";

// import Image from "next/image";
// import { AdminUser } from "../page";
// import { Pencil, Trash2, Eye } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function UsersTable({
//   users,
//   onView,
//   onEdit,
//   onDelete,
// }: {
//   users: AdminUser[];
//   onView: (user: AdminUser) => void;
//   onEdit: (user: AdminUser) => void;
//   onDelete: (user: AdminUser) => void;
// }) {
//   const router = useRouter();

//   return (
//     <div className="bg-white rounded-md shadow overflow-x-auto">
//       <table className="w-full text-sm">
//         <thead className="bg-gray-100 text-left">
//           <tr>
//             <th className="p-3">User</th>
//             <th className="p-3">Email</th>
//             <th className="p-3">Role</th>
//             <th className="p-3 text-right">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((u) => (
//             <tr
//               key={u._id}
//               className="border-t hover:bg-gray-50 cursor-pointer"
//               onClick={() => router.push(`/admin/users/${u._id}`)} // navigate to user detail
//             >
//               {/* Profile */}
//               <td className="p-3 flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
//                   {u.profileUrl ? (
//                     <Image
//                       src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${u.profileUrl}`}
//                       alt={`${u.firstName} profile`}
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <span className="font-semibold text-gray-600">
//                       {u.firstName?.[0]}
//                     </span>
//                   )}
//                 </div>

//                 <div>
//                   <p className="font-medium">
//                     {u.firstName} {u.lastName}
//                   </p>
//                   <p className="text-xs text-gray-500">@{u.username}</p>
//                 </div>
//               </td>

//               <td className="p-3">{u.email}</td>

//               <td className="p-3 capitalize">
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-medium ${
//                     u.role === "admin"
//                       ? "bg-red-100 text-red-700"
//                       : "bg-green-100 text-green-700"
//                   }`}
//                 >
//                   {u.role}
//                 </span>
//               </td>


//               {/* Actions */}
//               <td className="p-3 text-right">
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // prevent row click
//                       onView(u);
//                     }}
//                     className="p-2 rounded hover:bg-gray-100"
//                   >
//                     <Eye size={16} />
//                   </button>

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // prevent row click
//                       onEdit(u);
//                     }}
//                     className="p-2 rounded hover:bg-gray-100"
//                   >
//                     <Pencil size={16} />
//                   </button>

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // prevent row click
//                       onDelete(u);
//                     }}
//                     className="p-2 rounded hover:bg-red-100 text-red-600"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }










// "use client";

// import Image from "next/image";
// import { AdminUser } from "../page";
// import { Pencil, Trash2, Eye, Shield, User, Mail, AtSign } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { motion, Variants } from "framer-motion";

// export default function UsersTable({
//   users,
//   onView,
//   onEdit,
//   onDelete,
// }: {
//   users: AdminUser[];
//   onView: (user: AdminUser) => void;
//   onEdit: (user: AdminUser) => void;
//   onDelete: (user: AdminUser) => void;
// }) {
//   const router = useRouter();

//   // Animation variants for table rows with proper typing
//   const rowVariants: Variants = {
//     hidden: { 
//       opacity: 0, 
//       y: 20 
//     },
//     visible: (index: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: index * 0.05,
//         type: "spring",
//         stiffness: 100,
//         damping: 12
//       }
//     }),
//     hover: { 
//       scale: 1.01,
//       backgroundColor: "rgba(59, 130, 246, 0.05)",
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 25
//       }
//     }
//   };

//   // Animation variants for action buttons
//   const buttonVariants: Variants = {
//     hover: { 
//       scale: 1.1,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 25
//       }
//     },
//     tap: { 
//       scale: 0.95,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 25
//       }
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
//       className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
//     >
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
//               <th className="px-6 py-4 text-left">
//                 <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   User
//                 </span>
//               </th>
//               <th className="px-6 py-4 text-left">
//                 <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
//                   <Mail className="w-3 h-3" />
//                   Email
//                 </span>
//               </th>
//               <th className="px-6 py-4 text-left">
//                 <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Role
//                 </span>
//               </th>
//               <th className="px-6 py-4 text-right">
//                 <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Actions
//                 </span>
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//             {users.map((u, index) => (
//               <motion.tr
//                 key={u._id}
//                 custom={index}
//                 initial="hidden"
//                 animate="visible"
//                 whileHover="hover"
//                 variants={rowVariants}
//                 className="group cursor-pointer transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
//                 onClick={() => router.push(`/admin/users/${u._id}`)}
//               >
//                 {/* Profile */}
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-4">
//                     <motion.div 
//                       whileHover={{ scale: 1.1 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                       className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
//                     >
//                       {u.profileUrl ? (
//                         <Image
//                           src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${u.profileUrl}`}
//                           alt={`${u.firstName} profile`}
//                           fill
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <span className="text-white font-bold text-lg">
//                             {u.firstName?.[0]}{u.lastName?.[0]}
//                           </span>
//                         </div>
//                       )}
                      
//                       {/* Status indicator */}
//                       <motion.div 
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                         className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
//                       />
//                     </motion.div>

//                     <div>
//                       <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                         {u.firstName} {u.lastName}
//                         {u.role === 'admin' && (
//                           <Shield className="w-3.5 h-3.5 text-purple-500" />
//                         )}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
//                         <AtSign className="w-3 h-3" />
//                         @{u.username}
//                       </p>
//                     </div>
//                   </div>
//                 </td>

//                 {/* Email */}
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
//                     <Mail className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm">{u.email}</span>
//                   </div>
//                 </td>

//                 {/* Role */}
//                 <td className="px-6 py-4">
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                     className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${
//                       u.role === "admin"
//                         ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
//                         : "bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400 border border-green-200 dark:border-green-800"
//                     }`}
//                   >
//                     {u.role === "admin" ? (
//                       <Shield className="w-3.5 h-3.5" />
//                     ) : (
//                       <User className="w-3.5 h-3.5" />
//                     )}
//                     <span className="capitalize">{u.role}</span>
//                   </motion.div>
//                 </td>

//                 {/* Actions */}
//                 <td className="px-6 py-4">
//                   <div className="flex items-center justify-end gap-2">
//                     <motion.button
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onView(u);
//                       }}
//                       className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 shadow-sm hover:shadow"
//                       title="View user details"
//                     >
//                       <Eye size={18} />
//                     </motion.button>

//                     <motion.button
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onEdit(u);
//                       }}
//                       className="p-2.5 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition-all duration-200 shadow-sm hover:shadow"
//                       title="Edit user"
//                     >
//                       <Pencil size={18} />
//                     </motion.button>

//                     <motion.button
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDelete(u);
//                       }}
//                       className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-all duration-200 shadow-sm hover:shadow"
//                       title="Delete user"
//                     >
//                       <Trash2 size={18} />
//                     </motion.button>
//                   </div>
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Empty State */}
//       {users.length === 0 && (
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center py-20 px-4"
//         >
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-4">
//             <User className="w-10 h-10 text-gray-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//             No users found
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400">
//             Try adjusting your search or filter to find what you're looking for.
//           </p>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }

"use client";

import Image from "next/image";
import { AdminUser } from "../page";
import { Pencil, Trash2, Eye, Shield, User, Mail, AtSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

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
  const router = useRouter();

  // Animation variants for table rows with proper typing
  const rowVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }),
    hover: { 
      scale: 1.01,
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Animation variants for action buttons
  const buttonVariants: Variants = {
    hover: { 
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <tr>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3 h-3" />
              Email
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </span>
          </th>
          <th className="px-6 py-4 text-right">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </span>
          </th>
        </tr>
      </thead>

      {/* <tbody className="divide-y divide-gray-100 dark:divide-gray-700"> */}
      <tbody className="divide-y dark:divide-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        {users.map((u, index) => (
          <motion.tr
            key={u._id}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={rowVariants}
            className="group cursor-pointer transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            onClick={() => router.push(`/admin/users/${u._id}`)}
          >
            {/* Profile */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                >
                  {u.profileUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${u.profileUrl}`}
                      alt={`${u.firstName} profile`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                  />
                </motion.div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {u.firstName} {u.lastName}
                    {u.role === 'admin' && (
                      <Shield className="w-3.5 h-3.5 text-purple-500" />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <AtSign className="w-3 h-3" />
                    {u.username}
                  </p>
                </div>
              </div>
            </td>

            {/* Email */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{u.email}</span>
              </div>
            </td>

            {/* Role */}
            <td className="px-6 py-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${
                  u.role === "admin"
                    ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                    : "bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                }`}
              >
                {u.role === "admin" ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span className="capitalize">{u.role}</span>
              </motion.div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(u);
                  }}
                  className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 shadow-sm hover:shadow"
                  title="View user details"
                >
                  <Eye size={18} />
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(u);
                  }}
                  className="p-2.5 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition-all duration-200 shadow-sm hover:shadow"
                  title="Edit user"
                >
                  <Pencil size={18} />
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(u);
                  }}
                  className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-all duration-200 shadow-sm hover:shadow"
                  title="Delete user"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}