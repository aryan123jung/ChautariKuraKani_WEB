import Image from "next/image";

export default function ProfileAvatar({
  profileUrl,
}: {
  profileUrl?: string;
}) {
  return (
    <div className="relative w-32 h-32 -mt-16 rounded-full overflow-hidden border-4 border-white bg-gray-300">
      {profileUrl && (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/profile/${profileUrl}`}
          alt="Profile"
          fill
          className="object-cover"
        />
      )}
    </div>
  );
}
