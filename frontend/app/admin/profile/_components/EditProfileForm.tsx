"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { UpdateAdminData, updateAdminSchema } from "../schema";
import { useRouter } from "next/navigation";

interface AdminEditProfileProps {
  user: any; // admin object from db or cookie
  onCancel: () => void;
}

export default function EditAdminProfileForm({ user, onCancel }: AdminEditProfileProps) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const [form, setForm] = useState<UpdateAdminData>({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    profileUrl: undefined,
    coverUrl: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const profilePreview = form.profileUrl
    ? form.profileUrl instanceof File
      ? URL.createObjectURL(form.profileUrl)
      : `${backendUrl}/uploads/profile/${form.profileUrl}`
    : user.profileUrl
    ? `${backendUrl}/uploads/profile/${user.profileUrl}`
    : "/placeholder-profile.png";


  const coverPreview = form.coverUrl
    ? form.coverUrl instanceof File
      ? URL.createObjectURL(form.coverUrl)
      : `${backendUrl}/uploads/cover/${form.coverUrl}`
    : user.coverUrl
    ? `${backendUrl}/uploads/cover/${user.coverUrl}`
    : "/placeholder-cover.png";

  const onSubmit = async () => {
    setError(null);
    setLoading(true);

    const parsed = updateAdminSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", parsed.data.firstName);
      formData.append("lastName", parsed.data.lastName);
      formData.append("username", parsed.data.username);
      formData.append("email", parsed.data.email);

      formData.append("role", user.role); //mero admin ko role change hudaina

      if (parsed.data.profileUrl) formData.append("profileUrl", parsed.data.profileUrl);
      if (parsed.data.coverUrl) formData.append("coverUrl", parsed.data.coverUrl);

      const res = await handleUpdateProfile(formData);
      if (!res.success) throw new Error(res.message);

      toast.success("Profile updated successfully");
      router.refresh();
      onCancel();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">

      {/* Cover Image */}
      <div className="relative">
        <img
          src={coverPreview}
          alt="Cover Preview"
          className="w-full h-44 object-cover rounded-xl border border-gray-200"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, coverUrl: e.target.files?.[0] })}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-xl"
        />
      </div>


      {/* Profile Image + Form */}
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={profilePreview}
            alt="Profile Preview"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, profileUrl: e.target.files?.[0] })}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
          />
        </div>


        {/* Form Detail haru */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">First Name</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Last Name</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Username</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}


      <div className="flex justify-end gap-4">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
