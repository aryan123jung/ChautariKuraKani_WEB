// "use client";

// import { useState } from "react";
// import HomeFeed from "./HomeFeed";
// import FriendsFeed from "./FriendsFeed";


// type UserData = {
//   firstName: string;
//   lastName: string;
//   profileUrl?: string;
// };

// export default function FeedToggle({ user }: { user: UserData }) {
//   const [feed, setFeed] = useState<"home" | "friends">("home");

//   return (
//     <div>
//       <div className="flex justify-center gap-4 mb-4">
//         <button
//           className={`px-4 py-2 rounded-md font-semibold ${feed === "home" ? "text-green-600 underline" : "text-gray-700"}`}
//           onClick={() => setFeed("home")}
//         >
//           Home Feed
//         </button>
//         <button
//           className={`px-4 py-2 rounded-md font-semibold ${feed === "friends" ? "text-green-600 underline" : "text-gray-500"}`}
//           onClick={() => setFeed("friends")}
//         >
//           Friends Feed
//         </button>
//       </div>

//       {feed === "home" ? <HomeFeed user={user} /> : <FriendsFeed user={user} />}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import HomeFeed from "./HomeFeed";
import FriendsFeed from "./FriendsFeed";

type UserData = { firstName: string; lastName: string; profileUrl?: string };

export default function FeedToggle({ user }: { user: UserData }) {
  const [feed, setFeed] = useState<"home" | "friends">("home");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${feed === "home" ? "text-green-600 underline" : "text-gray-700"}`}
          onClick={() => setFeed("home")}
        >
          Home Feed
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${feed === "friends" ? "text-green-600 underline" : "text-gray-500"}`}
          onClick={() => setFeed("friends")}
        >
          Friends Feed
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {feed === "home" ? <HomeFeed user={user} /> : <FriendsFeed user={user} />}
      </div>
    </div>
  );
}
