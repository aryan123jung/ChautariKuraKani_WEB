import Image from "next/image";

export default function ProfileCover({
  coverUrl,
}: {
  coverUrl?: string;
}) {
  return (
    <div className="relative h-64 overflow-hidden bg-slate-200 sm:h-80">
      {coverUrl ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/cover/${coverUrl}`}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_15%_15%,#86efac_0%,#22c55e_18%,#0f172a_58%,#020617_100%)] dark:bg-[radial-gradient(circle_at_15%_15%,#65a30d_0%,#3f6212_16%,#09090b_62%,#000000_100%)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
      <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />
    </div>
  );
}
