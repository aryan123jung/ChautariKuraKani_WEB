"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminCreateUserSchema,
  AdminCreateUserData,
} from "@/app/admin/schema";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";

export default function CreateUserForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdminCreateUserData>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: { role: "user" },
  });

  const onSubmit = async (data: AdminCreateUserData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    const res = await handleCreateUser(payload);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("User created successfully!");
    reset();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* First Name */}
      <div>
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.lastName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Username */}
      <div>
        <input
          {...register("username")}
          placeholder="Username"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <select
          {...register("role")}
          className="w-full border border-gray-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
