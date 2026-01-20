"use client"; 

import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";

export default function LandingPage() {
  // const router = useRouter();
  return (
    <section className="relative w-full h-screen overflow-hidden">

      <Image
        src="/image/back3.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay text ko lagi */}
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">

          <div className="text-white">
            <h1 className="text-5xl font-bold leading-tight">
              Connect & Share <br />
              <span className="text-green-400">Instantly</span>
            </h1>

            <p className="mt-6 text-lg text-gray-200 max-w-xl">
              ChautariKuraKani is your digital chautari — connect, chat,
              and share moments with people who matter.
            </p>

            <div className="mt-8 flex gap-4">
              <Link href="/login">
              <button className="px-6 py-3 bg-green-500 rounded-xl font-semibold hover:bg-green-600 transition">
                Get Started
              </button>
              </Link>
              

              <button className="px-6 py-3 border border-white/60 rounded-xl hover:bg-white/10 transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="flex w-full">
            <Image
              src="/image/peo_bg.png"
              alt="People Illustration"
              width={900}
              height={900}
              className="ml-auto max-w-none w-[700px] lg:w-[850px] object-contain drop-shadow-2xl"
            />
          </div>

          {/* <div className="absolute bottom-65 right-20 z-20 flex items-center gap-3">
            <span className="text-gray-300 text-4xl font-bold tracking-wide">
              Chautarimah Sabai Kura
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
}
