import Image from "next/image";

export default function ProfileCover({
  coverUrl,
}: {
  coverUrl?: string;
}) {
  return (
    <div className="relative h-56 rounded-b-xl overflow-hidden bg-gray-200">
      {coverUrl && (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/cover/${coverUrl}`}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      )}
    </div>
  );
}
