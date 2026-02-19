import Image from "next/image";

export default function ProfileAvatar({
  profileUrl,
}: {
  profileUrl?: string;
}) {
  return (
    <div className="relative -mt-14 h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-300 shadow-lg sm:-mt-16 sm:h-36 sm:w-36">
      {profileUrl ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${profileUrl}`}
          alt="Profile"
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600">
          U
        </div>
      )}
    </div>
  );
}
