// "use client";

// import { getUserData } from "@/lib/cookie";
// import { get } from "http";
// import { useState } from "react";

// export default async function HomePage(){
//   const [feed, setFeed] = useState<"home" | "friends">("home");

//   const user = await getUserData();
//   if (!user) return null;

//   const homePosts = [
//     {
//       id: 1,
//       profileImg: "/image/h1.png",
//       user: "Ram Sharma",
//       time: "2h",
//       text: "Enjoy the view from the chautari",
//       img: "/image/p1.webp",
//     },
//     {
//       id: 2,
//       profileImg: "/image/h2.jpg",
//       user: "Dilip Pandey",
//       time: "2h",
//       text: "How’s this for a view 😏",
//       img: "/image/p2.jpeg",
//     },
//     {
//       id: 3,
//       profileImg: "/image/h3.jpg",
//       user: "Hari Khadka",
//       time: "2h",
//       text: "What a scene 😏",
//       img: "/image/p3.jpg",
//     },
//     {
//       id: 4,
//       profileImg: "/image/h4.jpg",
//       user: "Shyam Bahadur",
//       time: "2h",
//       text: "How are you guys????",
//     },
//   ];



// const friendsPosts = [
//   {
//     id: 1,
//     profileImg: "/image/h1.png",
//     user: "Anita Thapa",
//     time: "1h",
//     text: "Loving the sunny weather today! 🌞",
//   },
//   {
//     id: 2,
//     profileImg: "/image/h2.jpg",
//     user: "Binod Koirala",
//     time: "2h",
//     text: "Just finished a great hike in the hills 🏞️",
//     img: "/image/p2.jpeg",
//   },
//   {
//     id: 3,
//     profileImg: "/image/h3.jpg",
//     user: "Suman Gurung",
//     time: "3h",
//     text: "Coffee and good vibes ☕😊",
//     img: "/image/p3.jpg",
//   },
//   {
//     id: 4,
//     profileImg: "/image/h4.jpg",
//     user: "Kiran Shrestha",
//     time: "4h",
//     text: "Weekend adventures are the best! 🎉",
//     img: "/image/p2.jpeg",
//   },
// ];

//   const postsToShow = feed === "home" ? homePosts : friendsPosts;

//   return (
//     <div className="flex h-[calc(100vh-64px)] gap-4 p-4">

//       <aside className="w-1/4 flex-shrink-0 flex flex-col gap-4 overflow-hidden">
//         <div className="flex flex-col">
//           <h2 className="font-bold mb-2">Chautari</h2>
//           <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-hidden">
//             <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Chautari_Guff</li>
//             <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Ramailo_Kura</li>
//             <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Vibes</li>
//             <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Meme_dokan</li>
//             <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Sports</li>
//           </ul>
//         </div>





//         <div className="flex flex-col">
//           <h2 className="font-bold mb-2">Messages</h2>
//           <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-hidden">

//             <li className="flex items-center gap-2 bg-gray-200 rounded-md p-2 hover:bg-gray-300">
//               <div className="w-8 h-8 rounded-full overflow-hidden">
//                 <img src="/image/h1.png" alt="Hari Lama" className="w-full h-full object-cover" />
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">Hari Lama</p>
//                 <p className="text-xs text-gray-600">Paisa firta kaile dine?</p>
//               </div>
//             </li>

//             <li className="flex items-center gap-2 bg-gray-200 rounded-md p-2 hover:bg-gray-300">
//               <div className="w-8 h-8 rounded-full overflow-hidden">
//                 <img src="/image/h2.jpg" alt="Ram Sharma" className="w-full h-full object-cover" />
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">Ram Sharma</p>
//                 <p className="text-xs text-gray-600">K chaa sathi</p>
//               </div>
//             </li>

//             <li className="flex items-center gap-2 bg-gray-200 rounded-md p-2 hover:bg-gray-300">
//               <div className="w-8 h-8 rounded-full overflow-hidden">
//                 <img src="/image/h3.jpg" alt="Ram Sharma" className="w-full h-full object-cover" />
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">Shuyam Bahadur</p>
//                 <p className="text-xs text-gray-600">Jam Chiya khana</p>
//               </div>
//             </li>

//             <li className="flex items-center gap-2 bg-gray-200 rounded-md p-2 hover:bg-gray-300">
//               <div className="w-8 h-8 rounded-full overflow-hidden">
//                 <img src="/image/h4.jpg" alt="Ram Sharma" className="w-full h-full object-cover" />
//               </div>
//               <div>
//                 <p className="font-semibold text-sm">Kancha Khadka</p>
//                 <p className="text-xs text-gray-600">Haina Hola</p>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </aside>










//       <main className="flex-1 h-full flex flex-col overflow-hidden">
//         <div className="flex justify-center gap-4 mb-4">
//           <button
//             className={`px-4 py-2 rounded-md font-semibold ${feed === "home" ? " text-green-600 underline" : " text-gray-700"}`}
//             onClick={() => setFeed("home")}
//           >
//             Home Feed
//           </button>

//           <button
//             className={`px-4 py-2 rounded-md font-semibold ${feed === "friends" ? " text-green-600 underline" : " text-gray-500"}`}
//             onClick={() => setFeed("friends")}
//           >
//             Friends Feed
//           </button>
//         </div>




//         <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hidden">
//           {postsToShow.map((post) => (
//             <div key={post.id} className="bg-white rounded-md shadow p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-10 rounded-full overflow-hidden">
//                     <img src={post.profileImg} alt={post.user} className="w-full h-full object-cover" />
//                   </div>
//                   <div>
//                     <p className="font-semibold">{post.user}</p>
//                     <p className="text-xs text-gray-500">{post.time}</p>
//                   </div>
//                 </div>
//                 <span className="cursor-pointer">...</span>
//               </div>
//               <p className="mb-2">{post.text}</p>

//               {post.img && <img src={post.img} alt="Post image" className="w-full rounded-md" />}

//               <div className="flex gap-4 mt-2 text-gray-500">
//                 <button>👍</button>
//                 <button>👎</button>
//                 <button>💬</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>






//       <aside className="w-1/4 space-y-4 flex-shrink-0 flex flex-col overflow-hidden">
        
//         {/* <div className="flex items-center gap-2 bg-gray-300 rounded-md p-2">
//           <div className="w-10 h-10 rounded-full overflow-hidden">
//             <img src="/image/person.jpg" alt="Aryan Jung Chhetri" className="w-full h-full object-cover" />
//           </div>
//           <p className="font-semibold">Aryan Jung Chhetri</p>
//         </div> */}

//          <div className="flex items-center gap-2 bg-gray-300 rounded-md p-2">
//       <div className="w-10 h-10 rounded-full overflow-hidden">
//         <img
//           src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${user.profileUrl}`}
//           alt={`${user.firstName} ${user.lastName}`}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       <p className="font-semibold">
//         {user.firstName} {user.lastName}
//       </p>
//     </div>






//         <div className="bg-gray-100 rounded-md p-2 flex flex-col h-[90%]">
//           <div className="bg-green-500 text-white px-2 py-1 rounded-t-md font-semibold">AI Chat Bot</div>
//           <div className="p-2 space-y-2 flex-1 overflow-y-auto scrollbar-hidden">
//             <div className="bg-white rounded-md p-1">Heyyyyyyyyyyyyyyyyy</div>
//             <div className="bg-white rounded-md p-1">Hi!! How can I help you?</div>
//           </div>
//           <div className="flex mt-2">
//             <input
//               type="text"
//               placeholder="Ask me anything...."
//               className="flex-1 border border-gray-300 rounded-l-md px-2 outline-none"
//             />
//             <button className="bg-black text-white px-2 rounded-r-md">➤</button>
//           </div>
//         </div>
//       </aside>
//     </div>
//   );
// }







// import { getUserData } from "@/lib/cookie";
// import FeedToggle from "./_components/FeedToggle";

// export default async function HomePage() {
//   const user = await getUserData();
//   if (!user) return null;

//   return (
//     <div className="flex h-[calc(100vh-64px)] gap-4 p-4">
//       {/* Left sidebar */}
//       <aside className="w-1/4">{/* ... */}</aside>

//       {/* Main feed */}
//       <main className="flex-1">
//         <FeedToggle user={user} />
//       </main>

//       {/* Right sidebar */}
//       <aside className="w-1/4">{/* user info, chatbot, etc */}</aside>
//     </div>
//   );
// }
import { getUserData } from "@/lib/cookie";
import LeftSidebar from "./_components/LeftSidebar";
import RightSidebar from "./_components/RightSidebar";
import FeedToggle from "./_components/FeedToggle";

export default async function HomePage() {
  const user = await getUserData();
  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden gap-4 p-4">
      {/* Left sidebar */}
      <aside className="w-1/4 flex-shrink-0 overflow-hidden">
        <LeftSidebar />
      </aside>

      {/* Main feed */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <FeedToggle user={user} />
      </main>

      {/* Right sidebar */}
      <aside className="w-1/4 flex-shrink-0 overflow-hidden">
        <RightSidebar user={user} />
      </aside>
    </div>
  );
}
