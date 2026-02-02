"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { updateUserSchema, UpdateUserData } from "../schema";

export default function EditProfileForm({
  user,
  onCancel,
}: {
  user: any;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<UpdateUserData>({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    profileUrl: undefined,
    coverUrl: undefined,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);

    const parsed = updateUserSchema.safeParse(form);

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

      if (parsed.data.profileUrl) {
        formData.append("profileUrl", parsed.data.profileUrl);
      }

      if (parsed.data.coverUrl) {
        formData.append("coverUrl", parsed.data.coverUrl);
      }

      const res = await handleUpdateProfile(formData);

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success("Profile updated successfully");
      onCancel();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 bg-white shadow rounded-md p-6 space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) =>
          setForm({ ...form, firstName: e.target.value })
        }
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) =>
          setForm({ ...form, lastName: e.target.value })
        }
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <div>
        <label className="text-sm text-gray-600">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({
              ...form,
              profileUrl: e.target.files?.[0],
            })
          }
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({
              ...form,
              coverUrl: e.target.files?.[0],
            })
          }
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
