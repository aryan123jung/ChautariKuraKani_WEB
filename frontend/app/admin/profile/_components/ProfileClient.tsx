// "use client";

// import { useState } from "react";
// import ProfileDetails from "./ProfileDetails";
// import EditProfileForm from "./EditProfileForm";

// export default function ProfileClient({ user }: { user: any }) {
//   const [isEditing, setIsEditing] = useState(false);

//   return (
//     <>
//       {!isEditing ? (
//         <ProfileDetails user={user} onEdit={() => setIsEditing(true)} />
//       ) : (
//         <EditProfileForm user={user} onCancel={() => setIsEditing(false)} />
//       )}
//     </>
//   );
// }
"use client";

import { useState } from "react";
import ProfileDetails from "./ProfileDetails";
import UpdateUserForm from "../../users/_components/UpdateUserForm";
import { useRouter } from "next/navigation";

export default function ProfileClient({ user: initialUser }: { user: any }) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  return (
    <>
      {!isEditing ? (
        <ProfileDetails
          user={user}
          onEdit={() => setIsEditing(true)}
        />
      ) : (
        <UpdateUserForm
          user={user}
          onCancel={() => setIsEditing(false)}
          onSuccess={(updatedUser) => {
            setUser(updatedUser);   
            setIsEditing(false);    
            router.refresh();
          }}
        />
      )}
    </>
  );
}

