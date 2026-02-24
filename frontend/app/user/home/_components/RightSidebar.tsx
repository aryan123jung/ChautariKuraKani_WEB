// "use client";

// import Link from "next/link";

// type UserData = {
//   firstName: string;
//   lastName: string;
//   profileUrl?: string;
// };

// export default function RightSidebar({ user }: { user: UserData }) {
//   return (
//     <div className="flex flex-col gap-4">
//       {/* Profile */}
//       <Link href={"/user/profile"} className="flex items-center gap-2 bg-gray-300 rounded-md p-2">
//         <div className="w-10 h-10 rounded-full overflow-hidden">
//           <img
//             src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${user.profileUrl}`}
//             alt={`${user.firstName} ${user.lastName}`}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <p className="font-semibold">{user.firstName} {user.lastName}</p>
//       </Link>

//       {/* Chat Bot */}
//       <div className="bg-gray-100 rounded-md p-2 flex flex-col h-[90%]">
//         <div className="bg-green-500 text-white px-2 py-1 rounded-t-md font-semibold">AI Chat Bot</div>
//         <div className="p-2 space-y-2 flex-1 overflow-y-auto scrollbar-hidden">
//           <div className="bg-white rounded-md p-1">Heyyyyyyyyyyyyyyyyy</div>
//           <div className="bg-white rounded-md p-1">Hi!! How can I help you?</div>
//         </div>
//         <div className="flex mt-2">
//           <input
//             type="text"
//             placeholder="Ask me anything...."
//             className="flex-1 border border-gray-300 rounded-l-md px-2 outline-none"
//           />
//           <button className="bg-black text-white px-2 rounded-r-md">➤</button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {User} from "lucide-react";
import type { ChatMessage, HomeUserData } from "../schema";

export default function RightSidebar({ user }: { user: HomeUserData }) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "Hi!! How can I help you? 😄" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const profileImage = user.profileUrl
    ? `${backendUrl}/uploads/profile/${user.profileUrl}`
    : "/image/profile_icon_214017.ico";

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        data?: { text?: string };
        message?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to get AI response");
      }

      const aiText = data.data?.text || "No response from AI.";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Chatbot failed";
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `Oops, ${message}. Try again 🙏` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">

      {/* <Link
        href="/user/profile"
        className="
          flex items-center gap-2
          bg-gray-100
          rounded-md
          p-2
          border border-gray-300
          hover:border-green-500
          transition-colors duration-200
        "
      > */}
      {/* <Link
        href="/user/profile"
        className="
          flex items-center gap-2
          bg-gray-100
          rounded-md
          p-2
          border border-gray-300
          hover:border-green-500
          hover:bg-green-50
          hover:shadow-md
          transition-all duration-200
        "
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-semibold">
          {user.firstName} {user.lastName}
        </p>
      </Link> */}

      <Link
  href="/user/profile"
  className="
    flex items-center gap-3
    rounded-lg
    p-2
    border border-gray-200
    bg-white dark:bg-zinc-900 dark:border-zinc-700
    hover:border-green-500
    hover:bg-green-50 dark:hover:bg-zinc-800
    hover:shadow-sm
    transition-all duration-200
  "
>
  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-zinc-700">
    {profileImage ? (
      <img
        src={profileImage}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-full h-full object-cover"
      />
    ) : (
      <User className="w-5 h-5 text-gray-500" />
    )}
  </div>

  <div className="flex flex-col leading-tight">
    <p className="font-semibold text-sm text-gray-800 dark:text-zinc-100">
      {user.firstName} {user.lastName}
    </p>
    <span className="text-xs text-gray-500 dark:text-zinc-400">View profile</span>
  </div>
</Link>




      <div className="flex-1 min-h-0 bg-gray-100 dark:bg-zinc-900 rounded-md p-2 flex flex-col">
        <div className="bg-green-500 text-white px-2 py-1 rounded-t-md font-semibold">
          AI Chat Bot
        </div>

        <div className="p-2 space-y-2 flex-1 overflow-y-auto scrollbar-feed">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-md p-2 text-sm ${
                  isUser
                    ? "bg-green-600 text-white ml-6"
                    : "bg-white dark:bg-zinc-800 dark:text-zinc-200 mr-6"
                }`}
              >
                {message.text}
              </div>
            );
          })}

          {isLoading && (
            <div className="rounded-md p-2 text-sm bg-white dark:bg-zinc-800 dark:text-zinc-200 mr-6">
              Thinking...
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="flex mt-2">
          <input
            type="text"
            placeholder="Ask me anything...."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-zinc-100 rounded-l-md px-2 outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black dark:bg-zinc-700 text-white px-2 rounded-r-md disabled:opacity-50"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
