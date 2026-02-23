import Image from "next/image";

export default function ProfileAvatar({
  profileUrl,
}: {
  profileUrl?: string;
}) {
  return (
    <div className="relative -mt-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-lime-500 p-1.5 shadow-xl shadow-emerald-500/20 sm:-mt-20 sm:h-40 sm:w-40 dark:from-emerald-600 dark:via-lime-500 dark:to-green-700">
      <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-slate-300 dark:border-zinc-950">
        {profileUrl ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${profileUrl}`}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-slate-600 dark:text-zinc-300">
            U
          </div>
        )}
      </div>
    </div>
  );
}
