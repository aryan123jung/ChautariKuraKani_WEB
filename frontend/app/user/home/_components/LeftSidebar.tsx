"use client";

export default function LeftSidebar() {
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      {/* Chautari */}
      <div className="flex flex-col">
        <h2 className="font-bold mb-2">Chautari</h2>
        <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-hidden">
          <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Chautari_Guff</li>
          <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Ramailo_Kura</li>
          <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Vibes</li>
          <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Meme_dokan</li>
          <li className="bg-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-300">c/Sports</li>
        </ul>
      </div>

      {/* Messages */}
      <div className="flex flex-col">
        <h2 className="font-bold mb-2">Messages</h2>
        <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-hidden">
          {["Hari Lama", "Ram Sharma", "Shuyam Bahadur", "Kancha Khadka"].map((name, i) => (
            <li key={i} className="flex items-center gap-2 bg-gray-200 rounded-md p-2 hover:bg-gray-300">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={`/image/h${i + 1}.png`} alt={name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-gray-600">Message preview...</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
