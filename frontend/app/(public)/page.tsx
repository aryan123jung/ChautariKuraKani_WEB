"use client"; 

import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";

export default function LandingPage() {
  // const router = useRouter();
  return (
    <main className="w-full">
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/image/back3.jpeg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

        <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
          <Image
            src="/image/green_half_logo.png"
            alt="ChautariKuraKani Logo"
            width={42}
            height={42}
            priority
          />
          <span className="text-gray-300 text-xl font-semibold tracking-wide">
            ChautariKuraKani
          </span>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="text-white">
              <h1 className="text-5xl font-bold leading-tight">
                Connect & Share <br />
                <span className="text-green-400">Instantly</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-gray-200">
                ChautariKuraKani is your digital chautari - connect, chat,
                and share moments with people who matter.
              </p>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/login"
                  className="rounded-xl bg-green-500 px-6 py-3 font-semibold transition hover:bg-green-600"
                >
                  Get Started
                </Link>

                <Link
                  href="#learn-more"
                  className="rounded-xl border border-white/60 px-6 py-3 transition hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="flex w-full">
              <Image
                src="/image/peo_bg.png"
                alt="People Illustration"
                width={900}
                height={900}
                className="ml-auto max-w-none w-[700px] object-contain drop-shadow-2xl lg:w-[850px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="learn-more" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900">Why ChautariKuraKani</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            A simple social space for conversations, communities, and staying connected.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">Home & Friends Feed</h3>
              <p className="mt-2 text-sm text-slate-600">
                Switch between broad posts and friend-focused updates quickly.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">Chautari Communities</h3>
              <p className="mt-2 text-sm text-slate-600">
                Join communities, create posts, and manage discussions in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">Messaging</h3>
              <p className="mt-2 text-sm text-slate-600">
                Chat instantly with your friends through one-to-one conversations.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">Audio & Video Calling</h3>
              <p className="mt-2 text-sm text-slate-600">
                Start real-time voice and video calls directly from messages.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">Safe Reporting</h3>
              <p className="mt-2 text-sm text-slate-600">
                Report harmful content and keep the platform healthier for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
