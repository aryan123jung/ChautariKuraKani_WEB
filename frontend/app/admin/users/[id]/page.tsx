
import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import Image from "next/image";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const response = await handleGetOneUser(id);

    if (!response.success) {
        throw new Error(response.message || 'Failed to load user');
    }

    const user = response.data;

    // Base URL for images
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    return (
        <div className="max-w-3xl mx-auto mt-6">
            <div className="flex items-center justify-between mb-4">
                <Link href="/admin/users" className="text-blue-500 hover:underline">
                    Back to Users
                </Link>

                {/* <button
                    // href={`/admin/users/${id}/edit`}
                    className="text-green-500 hover:underline"
                >
                    Edit User
                </button>  */}
            </div>

            {/* Cover Image */}
            {user.coverUrl && (
                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg relative">
                    <Image
                        src={`${baseUrl}/uploads/cover/${user.coverUrl}`}
                        alt={`${user.firstName} cover`}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Profile Image */}
            {user.profileUrl && (
                <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-gray-300 relative">
                    <Image
                        src={`${baseUrl}/uploads/profile/${user.profileUrl}`}
                        alt={`${user.firstName} profile`}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4">
                User Details
            </h1>

            <div className="border border-gray-300 rounded-lg p-4 space-y-2">
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
}
