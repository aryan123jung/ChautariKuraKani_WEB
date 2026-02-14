// "use client";

// import { useEffect } from "react";
// import { X } from "lucide-react";
// import UpdateUserForm from "./UpdateUserForm";

// interface UpdateUserModalProps {
//   user: any;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function UpdateUserModal({ user, onClose, onSuccess }: UpdateUserModalProps) {
//   // Prevent body scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEscape);
//     return () => window.removeEventListener("keydown", handleEscape);
//   }, [onClose]);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         className="fixed inset-0 bg-black/50 z-50"
//         aria-hidden="true"
//       />

//       {/* Modal */}
//       <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
//         <div className="flex min-h-full items-center justify-center p-4">
//           <div 
//             className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//               <h2 className="text-lg font-semibold text-gray-900">Update User</h2>
//               <button
//                 onClick={onClose}
//                 className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             {/* Form */}
//             <div className="px-5 py-4">
//               <UpdateUserForm
//                 user={user}
//                 onSuccess={onSuccess}
//                 onCancel={onClose}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



// "use client";

// import { useEffect } from "react";
// import { X } from "lucide-react";
// import UpdateUserForm from "./UpdateUserForm";

// interface UpdateUserModalProps {
//   user: any;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function UpdateUserModal({ user, onClose, onSuccess }: UpdateUserModalProps) {
//   // Prevent body scroll while modal is open
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   // Close modal on Escape key
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEscape);
//     return () => window.removeEventListener("keydown", handleEscape);
//   }, [onClose]);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         className="fixed inset-0 bg-black/50 z-50 transition-opacity"
//         aria-hidden="true"
//       />

//       {/* Modal Container */}
//       <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
//         <div
//           className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl transition-transform"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-900">Update User</h2>
//             <button
//               onClick={onClose}
//               className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           {/* Form Body */}
//           <div className="px-5 py-4">
//             <UpdateUserForm
//               user={user}
//               onSuccess={onSuccess}
//               onCancel={onClose}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }







// "use client";

// import { useEffect } from "react";
// import { X } from "lucide-react";
// import UpdateUserForm from "./UpdateUserForm";

// interface UpdateUserModalProps {
//   user: any;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function UpdateUserModal({ user, onClose, onSuccess }: UpdateUserModalProps) {
//   // Prevent body scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEscape);
//     return () => window.removeEventListener("keydown", handleEscape);
//   }, [onClose]);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         className="fixed inset-0 bg-black/50 z-50"
//         aria-hidden="true"
//       />

//       {/* Modal */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
//         <div
//           className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-visible"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-900">Update User</h2>
//             <button
//               onClick={onClose}
//               className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           {/* Form */}
//           <div className="px-5 py-4">
//             <UpdateUserForm
//               user={user}
//               onSuccess={onSuccess}
//               onCancel={onClose}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import UpdateUserForm from "./UpdateUserForm";

interface UpdateUserModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateUserModal({ user, onClose, onSuccess }: UpdateUserModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          
          {/* Modal Card */}
          <div 
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Update User</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Edit user information for <span className="font-medium text-gray-700">{user.username || user.email}</span>
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            {/* Form Container */}
            <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <UpdateUserForm
                user={user}
                onCancel={onClose}
                onSuccess={() => {
                  onSuccess();
                  onClose();
                }}
              />
            </div>

            {/* Footer Note */}
            <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-red-500">*</span> Required fields
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}