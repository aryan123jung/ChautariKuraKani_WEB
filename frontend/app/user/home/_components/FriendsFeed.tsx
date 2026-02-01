// "use client";

// type UserData = { firstName: string; lastName: string; profileUrl?: string };

// export default function FriendsFeed({ user }: { user: UserData }) {
//   const posts = [
//     { id: 1, user: "Ram Sharma", text: "Enjoy the view", profileImg: "/image/h1.png" },
//     { id: 2, user: "Dilip Pandey", text: "How’s this for a view 😏", profileImg: "/image/h2.jpg" },
//   ];

//   return (
//     <div className="space-y-4">
//       {posts.map((post) => (
//         <div key={post.id} className="bg-white rounded-md shadow p-4">
//           <div className="flex items-center gap-2">
//             <img src={post.profileImg} alt={post.user} className="w-10 h-10 rounded-full" />
//             <p className="font-semibold">{post.user}</p>
//           </div>
//           <p>{post.text}</p>
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";

type UserData = { firstName: string; lastName: string; profileUrl?: string };

type Post = {
  id: number;
  user: string;
  profileImg: string;
  text: string;
  time: string;
  img?: string; // optional post image
};

export default function FriendsFeed({ user }: { user: UserData }) {
  const posts: Post[] = [
  {
    id: 1,
    user: "Suman Gurung",
    profileImg: "/image/h3.jpg",
    text: "Coffee and good vibes ☕😊",
    time: "3h",
    img: "/image/p3.jpg",
  },
  {
    id: 2,
    user: "Anita Thapa",
    profileImg: "/image/h1.png",
    text: "Loving the sunny weather today! 🌞",
    time: "1h",
    img: "/image/p1.webp",
  },
  {
    id: 3,
    user: "Hari Khadka",
    profileImg: "/image/h3.jpg",
    text: "What a scene 😍",
    time: "5h",
  },
  {
    id: 4,
    user: "Kiran Shrestha",
    profileImg: "/image/h4.jpg",
    text: "Weekend adventures are the best! 🎉",
    time: "4h",
    img: "/image/p2.jpeg",
  },
  {
    id: 5,
    user: "Binod Koirala",
    profileImg: "/image/h2.jpg",
    text: "Just finished a great hike in the hills 🏞️",
    time: "2h",
    img: "/image/p2.jpeg",
  },
];


  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-md shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img
                src={post.profileImg}
                alt={post.user}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{post.user}</p>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>
            <span className="cursor-pointer">...</span>
          </div>
          <p className="mb-2">{post.text}</p>
          {post.img && (
            <img
              src={post.img}
              alt="Post image"
              className="w-full rounded-md object-cover"
            />
          )}
          <div className="flex gap-4 mt-2 text-gray-500">
            <button>👍</button>
            <button>👎</button>
            <button>💬</button>
          </div>
        </div>
      ))}
    </div>
  );
}
