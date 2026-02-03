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

//profile_icon_214017.ico

//const profilePreview = form.profileUrl
    // ? form.profileUrl instanceof File
    //   ? URL.createObjectURL(form.profileUrl)
    //   : `${backendUrl}/uploads/profile/${form.profileUrl}`
    // : user.profileUrl
    // ? `${backendUrl}/uploads/profile/${user.profileUrl}`
    // : "/image/profile_icon_214017.ico/";
