"use server";

import {
    handleGetAdminUserProfile,
    handleGetOneUser,
} from "@/lib/actions/admin/user-action";
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
    const profileResponse = await handleGetAdminUserProfile(id, 1, 20);
    const userPosts =
        profileResponse.success &&
        profileResponse.data &&
        Array.isArray(profileResponse.data.posts)
            ? (profileResponse.data.posts as Array<Record<string, unknown>>)
            : [];

    // Base URL for images
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6060";
    const buildPostMediaUrl = (mediaUrl: string, mediaType: string) =>
        `${baseUrl}/uploads/posts/${mediaType === "video" ? "videos" : "images"}/${mediaUrl}`;
    const getAuthorName = (author: unknown) => {
        if (!author || typeof author === "string") return `${user.firstName} ${user.lastName}`.trim();
        const typed = author as { firstName?: string; lastName?: string };
        return `${typed.firstName || ""} ${typed.lastName || ""}`.trim() || "User";
    };
    const getAuthorProfileUrl = (author: unknown) => {
        if (!author || typeof author === "string") return user.profileUrl || "";
        const typed = author as { profileUrl?: string; profileImage?: string };
        return typed.profileUrl || typed.profileImage || "";
    };

    // Format date if available
    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : null;

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col">
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

                <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto pr-1">
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

                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">User Posts</h2>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                    {userPosts.length} total
                                </span>
                            </div>

                            {userPosts.length === 0 && (
                                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                                    No posts from this user.
                                </div>
                            )}

                            <div className="space-y-5">
                                {userPosts.map((post, index) => {
                                    const mediaUrl = typeof post.mediaUrl === "string" ? post.mediaUrl : "";
                                    const mediaType = typeof post.mediaType === "string" ? post.mediaType : "";
                                    const caption = typeof post.caption === "string" ? post.caption : "";
                                    const createdAt = typeof post.createdAt === "string" ? post.createdAt : "";
                                    const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
                                    const commentsCount =
                                        typeof post.commentsCount === "number" ? post.commentsCount : 0;
                                    const authorName = getAuthorName(post.authorId);
                                    const authorProfile = getAuthorProfileUrl(post.authorId);

                                    return (
                                        <article
                                            key={String(post._id || `${id}-${index}`)}
                                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                                        >
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                                                        {authorProfile ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={`${baseUrl}/uploads/profile/${authorProfile}`}
                                                                alt={authorName}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-700">
                                                                {authorName.slice(0, 1).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{authorName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {createdAt ? new Date(createdAt).toLocaleString() : ""}
                                                        </p>
                                                    </div>
                                                </div>

                                                {caption && (
                                                    <p className="mb-2 whitespace-pre-wrap text-sm text-gray-800">{caption}</p>
                                                )}
                                            </div>

                                            {mediaUrl && mediaType === "image" && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={buildPostMediaUrl(mediaUrl, mediaType)}
                                                    alt="User post"
                                                    className="max-h-[32rem] w-full object-cover"
                                                />
                                            )}

                                            {mediaUrl && mediaType === "video" && (
                                                <video
                                                    src={buildPostMediaUrl(mediaUrl, mediaType)}
                                                    controls
                                                    className="w-full bg-black"
                                                />
                                            )}

                                            <div className="border-t px-4 py-2 text-xs text-gray-500">
                                                <div className="flex items-center justify-between">
                                                    <span>{likesCount} likes</span>
                                                    <span>{commentsCount} comments</span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
