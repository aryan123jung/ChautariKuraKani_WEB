// "use client";

// import { useState } from "react";
// import { Edit } from "lucide-react";
// import UpdateUserModal from "../_components/UpdateUserModal";

// export function EditUserButton({ user }: { user: any }) {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <>
//             <button
//                 onClick={() => setIsOpen(true)}
//                 className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//             >
//                 <Edit className="w-4 h-4" />
//                 <span>Edit User</span>
//             </button>

//             {isOpen && (
//                 <UpdateUserModal
//                     user={user}
//                     onClose={() => setIsOpen(false)}
//                     onSuccess={() => {
//                         setIsOpen(false);
//                         window.location.reload(); // Refresh to show updated data
//                     }}
//                 />
//             )}
//         </>
//     );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import UpdateUserModal from "../../_components/UpdateUserModal";

export function EditUserButton({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
                <Edit className="w-4 h-4" />
                <span>Edit User</span>
            </button>

            {isOpen && (
                <UpdateUserModal
                    user={user}
                    onClose={() => setIsOpen(false)}
                    onSuccess={() => {
                        setIsOpen(false);
                        router.refresh();
                    }}
                />
            )}
        </>
    );
}