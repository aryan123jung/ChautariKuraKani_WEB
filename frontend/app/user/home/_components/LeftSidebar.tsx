"use client";

export default function LeftSidebar() {
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {/* Chautari */}
      <div className="flex flex-col">
        <h2 className="font-bold mb-2 text-gray-900 dark:text-zinc-100">Chautari</h2>
        <ul className="scrollbar-feed space-y-2 max-h-48 overflow-y-auto">
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Chautari_Guff</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Ramailo_Kura</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Vibes</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Meme_dokan</li>
          <li className="bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 rounded-md p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-800">c/Sports</li>
        </ul>
      </div>

      {/* Messages */}
      <div className="flex flex-col">
        <h2 className="font-bold mb-2 text-gray-900 dark:text-zinc-100">Messages</h2>
        <ul className="scrollbar-feed space-y-2 max-h-48 overflow-y-auto">
          {["Hari Lama", "Ram Sharma", "Shuyam Bahadur", "Kancha Khadka"].map((name, i) => (
            <li key={i} className="flex items-center gap-2 bg-gray-200 dark:bg-zinc-900 rounded-md p-2 hover:bg-gray-300 dark:hover:bg-zinc-800">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={`/image/h${i + 1}.png`} alt={name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-zinc-100">{name}</p>
                <p className="text-xs text-gray-600 dark:text-zinc-400">Message preview...</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
