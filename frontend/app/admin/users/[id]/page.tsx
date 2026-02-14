
// import { handleGetOneUser } from "@/lib/actions/admin/user-action";
// import Link from "next/link";
// import Image from "next/image";

// export default async function Page({
//     params
// }: {
//     params: Promise<{ id: string }>;
// }) {
//     const { id } = await params;

//     const response = await handleGetOneUser(id);

//     if (!response.success) {
//         throw new Error(response.message || 'Failed to load user');
//     }

//     const user = response.data;

//     // Base URL for images
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//     return (
//         <div className="max-w-3xl mx-auto mt-6">
//             <div className="flex items-center justify-between mb-4">
//                 <Link href="/admin/users" className="text-blue-500 hover:underline">
//                     Back to Users
//                 </Link>

//                 {/* <button
//                     // href={`/admin/users/${id}/edit`}
//                     className="text-green-500 hover:underline"
//                 >
//                     Edit User
//                 </button>  */}
//             </div>

//             {/* Cover Image */}
//             {user.coverUrl && (
//                 <div className="w-full h-48 mb-4 overflow-hidden rounded-lg relative">
//                     <Image
//                         src={`${baseUrl}/uploads/cover/${user.coverUrl}`}
//                         alt={`${user.firstName} cover`}
//                         fill
//                         className="object-cover"
//                     />
//                 </div>
//             )}

//             {/* Profile Image */}
//             {user.profileUrl && (
//                 <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-gray-300 relative">
//                     <Image
//                         src={`${baseUrl}/uploads/profile/${user.profileUrl}`}
//                         alt={`${user.firstName} profile`}
//                         fill
//                         className="object-cover"
//                     />
//                 </div>
//             )}

//             <h1 className="text-2xl font-bold mb-4">
//                 User Details
//             </h1>

//             <div className="border border-gray-300 rounded-lg p-4 space-y-2">
//                 <p><strong>First Name:</strong> {user.firstName}</p>
//                 <p><strong>Last Name:</strong> {user.lastName}</p>
//                 <p><strong>Email:</strong> {user.email}</p>
//                 <p><strong>Username:</strong> {user.username}</p>
//                 <p><strong>Role:</strong> {user.role}</p>
//             </div>
//         </div>
//     );
// }






































// import { handleGetOneUser } from "@/lib/actions/admin/user-action";
// import Link from "next/link";
// import Image from "next/image";
// import { ArrowLeft, Edit, Mail, User as UserIcon, Calendar, Shield, AtSign } from "lucide-react";

// export default async function Page({
//     params
// }: {
//     params: Promise<{ id: string }>;
// }) {
//     const { id } = await params;

//     const response = await handleGetOneUser(id);

//     if (!response.success) {
//         throw new Error(response.message || 'Failed to load user');
//     }

//     const user = response.data;

//     // Base URL for images
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//     // Format date if available (assuming user has createdAt field)
//     const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
//         month: 'long',
//         day: 'numeric',
//         year: 'numeric'
//     }) : null;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
//             <div className="max-w-5xl mx-auto">
//                 {/* Header with navigation */}
//                 <div className="flex items-center justify-between mb-8">
//                     <Link 
//                         href="/admin/users" 
//                         className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
//                     >
//                         <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//                         <span>Back to Users</span>
//                     </Link>

//                     <Link
//                         href={`/admin/users/${id}/edit`}
//                         className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                     >
//                         <Edit className="w-4 h-4" />
//                         <span>Edit User</span>
//                     </Link>
//                 </div>

//                 {/* Main Content Card */}
//                 <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
//                     {/* Cover Image Section */}
//                     {user.coverUrl ? (
//                         <div className="relative h-64 w-full bg-gradient-to-r from-blue-600 to-indigo-600">
//                             <Image
//                                 src={`${baseUrl}/uploads/cover/${user.coverUrl}`}
//                                 alt={`${user.firstName} cover`}
//                                 fill
//                                 className="object-cover"
//                                 priority
//                             />
//                             {/* Overlay gradient for better text visibility */}
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
//                         </div>
//                     ) : (
//                         <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />
//                     )}

//                     {/* Profile Section */}
//                     <div className="relative px-8 pb-8">
//                         {/* Profile Image - Positioned to overlap cover */}
//                         <div className="flex items-end gap-6 -mt-16 mb-6">
//                             <div className="relative">
//                                 {user.profileUrl ? (
//                                     <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
//                                         <Image
//                                             src={`${baseUrl}/uploads/profile/${user.profileUrl}`}
//                                             alt={`${user.firstName} profile`}
//                                             fill
//                                             className="object-cover"
//                                             priority
//                                         />
//                                     </div>
//                                 ) : (
//                                     <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-white shadow-2xl flex items-center justify-center">
//                                         <span className="text-white text-4xl font-bold">
//                                             {user.firstName?.[0]}{user.lastName?.[0]}
//                                         </span>
//                                     </div>
//                                 )}
//                                 {/* Status Badge */}
//                                 <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
//                             </div>

//                             {/* User Name and Role */}
//                             <div className="flex-1 pt-16">
//                                 <div className="flex items-center gap-3">
//                                     <h1 className="text-3xl font-bold text-gray-900">
//                                         {user.firstName} {user.lastName}
//                                     </h1>
//                                     <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
//                                         user.role === 'admin' 
//                                             ? 'bg-purple-100 text-purple-700 border border-purple-200' 
//                                             : 'bg-green-100 text-green-700 border border-green-200'
//                                     }`}>
//                                         {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
//                                         {user.role}
//                                     </span>
//                                 </div>
//                                 <p className="text-gray-500 mt-1 flex items-center gap-2">
//                                     <AtSign className="w-4 h-4" />
//                                     @{user.username}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* User Details Grid */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//                             {/* Email Card */}
//                             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="p-3 bg-blue-100 rounded-xl">
//                                         <Mail className="w-5 h-5 text-blue-600" />
//                                     </div>
//                                     <h3 className="font-semibold text-gray-900">Email Address</h3>
//                                 </div>
//                                 <p className="text-gray-600 ml-14">{user.email}</p>
//                                 <p className="text-xs text-gray-400 ml-14 mt-1">Primary email</p>
//                             </div>

//                             {/* Account Details Card */}
//                             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="p-3 bg-purple-100 rounded-xl">
//                                         <UserIcon className="w-5 h-5 text-purple-600" />
//                                     </div>
//                                     <h3 className="font-semibold text-gray-900">Account Details</h3>
//                                 </div>
//                                 <div className="space-y-2 ml-14">
//                                     <p className="text-gray-600">
//                                         <span className="text-gray-400">Username:</span> {user.username}
//                                     </p>
//                                     <p className="text-gray-600">
//                                         <span className="text-gray-400">User ID:</span> {user._id.slice(-8)}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Personal Information Card */}
//                             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="p-3 bg-green-100 rounded-xl">
//                                         <UserIcon className="w-5 h-5 text-green-600" />
//                                     </div>
//                                     <h3 className="font-semibold text-gray-900">Personal Information</h3>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-14">
//                                     <div>
//                                         <p className="text-sm text-gray-400">First Name</p>
//                                         <p className="text-gray-900 font-medium">{user.firstName}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-400">Last Name</p>
//                                         <p className="text-gray-900 font-medium">{user.lastName}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-400">Full Name</p>
//                                         <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Joined Date (if available) */}
//                             {joinedDate && (
//                                 <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-3 bg-amber-100 rounded-xl">
//                                             <Calendar className="w-5 h-5 text-amber-600" />
//                                         </div>
//                                         <div>
//                                             <h3 className="font-semibold text-gray-900">Member Since</h3>
//                                             <p className="text-gray-600">{joinedDate}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
//                             <Link
//                                 href={`/admin/users/${id}/activity`}
//                                 className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-300"
//                             >
//                                 View Activity
//                             </Link>
//                             <Link
//                                 href={`/admin/users/${id}/permissions`}
//                                 className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-300"
//                             >
//                                 Manage Permissions
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }























"use server";

import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, User as UserIcon, Calendar, Shield, AtSign } from "lucide-react";
import { EditUserButton } from "./_components/UserActions";

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

    // Format date if available
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header with navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Link 
                        href="/admin/users" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Users</span>
                    </Link>

                    {/* Use the client component for edit button */}
                    <EditUserButton user={user} />
                </div>

                {/* Rest of your JSX (unchanged) */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Cover Image Section */}
                    {user.coverUrl ? (
                        <div className="relative h-64 w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                            <Image
                                src={`${baseUrl}/uploads/cover/${user.coverUrl}`}
                                alt={`${user.firstName} cover`}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                    ) : (
                        <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                    )}

                    {/* Profile Section */}
                    <div className="relative px-8 pb-8">
                        {/* Profile Image - Positioned to overlap cover */}
                        <div className="flex items-end gap-6 -mt-16 mb-6">
                            <div className="relative">
                                {user.profileUrl ? (
                                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                                        <Image
                                            src={`${baseUrl}/uploads/profile/${user.profileUrl}`}
                                            alt={`${user.firstName} profile`}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-white shadow-2xl flex items-center justify-center">
                                        <span className="text-white text-4xl font-bold">
                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                        </span>
                                    </div>
                                )}
                                {/* Status Badge */}
                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                            </div>

                            {/* User Name and Role */}
                            <div className="flex-1 pt-16">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                        user.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                            : 'bg-green-100 text-green-700 border border-green-200'
                                    }`}>
                                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </div>
                                <p className="text-gray-500 mt-1 flex items-center gap-2">
                                    <AtSign className="w-4 h-4" />
                                    @{user.username}
                                </p>
                            </div>
                        </div>

                        {/* User Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Email Card */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Email Address</h3>
                                </div>
                                <p className="text-gray-600 ml-14">{user.email}</p>
                                <p className="text-xs text-gray-400 ml-14 mt-1">Primary email</p>
                            </div>

                            {/* Account Details Card */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-100 rounded-xl">
                                        <UserIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Account Details</h3>
                                </div>
                                <div className="space-y-2 ml-14">
                                    <p className="text-gray-600">
                                        <span className="text-gray-400">Username:</span> {user.username}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="text-gray-400">User ID:</span> {user._id.slice(-8)}
                                    </p>
                                </div>
                            </div>

                            {/* Personal Information Card */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-100 rounded-xl">
                                        <UserIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Personal Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-14">
                                    <div>
                                        <p className="text-sm text-gray-400">First Name</p>
                                        <p className="text-gray-900 font-medium">{user.firstName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Last Name</p>
                                        <p className="text-gray-900 font-medium">{user.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Full Name</p>
                                        <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Joined Date (if available) */}
                            {joinedDate && (
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-amber-100 rounded-xl">
                                            <Calendar className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Member Since</h3>
                                            <p className="text-gray-600">{joinedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                            <Link
                                href={`/admin/users/${id}/activity`}
                                className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-300"
                            >
                                View Activity
                            </Link>
                            <Link
                                href={`/admin/users/${id}/permissions`}
                                className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-300"
                            >
                                Manage Permissions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}