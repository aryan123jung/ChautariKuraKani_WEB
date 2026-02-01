"use client";

import Link from "next/link";

type UserData = {
  firstName: string;
  lastName: string;
  profileUrl?: string;
};

export default function RightSidebar({ user }: { user: UserData }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Profile */}
      <Link href={"/user/profile"} className="flex items-center gap-2 bg-gray-300 rounded-md p-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${user.profileUrl}`}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-semibold">{user.firstName} {user.lastName}</p>
      </Link>

      {/* Chat Bot */}
      <div className="bg-gray-100 rounded-md p-2 flex flex-col h-[90%]">
        <div className="bg-green-500 text-white px-2 py-1 rounded-t-md font-semibold">AI Chat Bot</div>
        <div className="p-2 space-y-2 flex-1 overflow-y-auto scrollbar-hidden">
          <div className="bg-white rounded-md p-1">Heyyyyyyyyyyyyyyyyy</div>
          <div className="bg-white rounded-md p-1">Hi!! How can I help you?</div>
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            placeholder="Ask me anything...."
            className="flex-1 border border-gray-300 rounded-l-md px-2 outline-none"
          />
          <button className="bg-black text-white px-2 rounded-r-md">➤</button>
        </div>
      </div>
    </div>
  );
}
