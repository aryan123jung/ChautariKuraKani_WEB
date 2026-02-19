import Image from "next/image";

export default function ProfileCover({
  coverUrl,
}: {
  coverUrl?: string;
}) {
  return (
    <div className="relative h-56 overflow-hidden bg-slate-200 sm:h-72">
      {coverUrl ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/cover/${coverUrl}`}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#10b981_0%,#0f172a_45%,#1e293b_100%)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
    </div>
  );
}
