// "use client";

// import CreateUserForm from "./CreateUserForm";

// export default function CreateUserModal({
//   onClose,
//   onSuccess,
// }: {
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   return (
//     <>
//       <div
//         onClick={onClose}
//         className="fixed inset-0 bg-black/40 z-40"
//       />

//       <div className="fixed inset-0 z-50 flex items-center justify-center">
//         <div className="bg-white w-full max-w-md rounded-md shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">
//             Create New User
//           </h2>

//           <CreateUserForm
//             onCancel={onClose}
//             onSuccess={() => {
//               onSuccess();
//               onClose();
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// }





"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import CreateUserForm from "./CreateUserForm";

export default function CreateUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              {/* <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Create New User
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Add a new user to the platform
                </p>
              </div> */}
              <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Create New User</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the information below to create a new user account
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
              <CreateUserForm
                onCancel={onClose}
                onSuccess={() => {
                  onSuccess();
                  onClose();
                }}
              />
            </div>

            {/* Footer Note (Optional) */}
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