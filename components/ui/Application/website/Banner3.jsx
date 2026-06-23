"use client";

import Image from "next/image";
import {
  FaInstagram,
  FaTiktok,
  FaThreads,
  FaArrowRight,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa6";

export default function FooterPromo() {
  const gallery = [
    "/images/burger1.jpg",
    "/images/burger2.jpg",
    "/images/burger3.jpg",
    "/images/burger4.jpg",
    "/images/burger5.jpg",
  ];

  return (
    <section className="w-full bg-black text-white px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0b0b]">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* LEFT */}
          <div className="relative overflow-hidden border-b border-zinc-800 p-6 sm:p-8 lg:border-b-0 lg:border-r min-h-[420px] flex flex-col justify-between">
            <div className="relative z-10 max-w-md">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black uppercase leading-[1.05]">
                Get 20% Off
                <br />
                Your First Order!
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                Sign up for early access, exclusive offers and opening day
                treats.
              </p>

              {/* INPUT */}
              <div className="mt-7 flex w-full flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-[54px] flex-1 border border-zinc-700 bg-transparent px-4 text-sm outline-none placeholder:text-zinc-500"
                />

                <button className="flex h-[54px] w-full sm:w-[70px] items-center justify-center bg-orange-500 transition hover:bg-orange-600">
                  <FaArrowRight className="text-lg text-white" />
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-500">
                We respect your privacy.
              </p>
            </div>

            {/* PHONE */}
            <div className="pointer-events-none absolute bottom-0 right-0 hidden md:block opacity-90">
              <Image
                src="/images/phone.png"
                alt="phone"
                width={240}
                height={340}
                className="h-auto w-[180px] lg:w-[240px] object-contain"
              />
            </div>
          </div>

          {/* CENTER */}
          <div className="border-b border-zinc-800 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <h3 className="text-2xl sm:text-3xl font-black uppercase">
              Follow Our Journey
            </h3>

            <p className="mt-1 text-sm text-orange-500">@smashcoin</p>

            {/* GALLERY */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {gallery.map((img, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={img}
                    alt={`gallery-${index}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>

            {/* SOCIAL */}
            <div className="mt-7 flex items-center gap-5">
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 text-xl transition hover:border-orange-500 hover:text-orange-500"
              >
                <FaTiktok />
              </a>

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 text-xl transition hover:border-orange-500 hover:text-orange-500"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 text-xl transition hover:border-orange-500 hover:text-orange-500"
              >
                <FaThreads />
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <h3 className="text-3xl sm:text-4xl font-black uppercase leading-tight">
              Download Our App
            </h3>

            <p className="mt-2 text-zinc-400">Coming Soon</p>

            {/* STORE BUTTONS */}
            <div className="mt-8 flex flex-col gap-4">
              <button className="flex items-center gap-4 rounded-2xl border border-zinc-700 px-5 py-4 transition hover:border-orange-500 hover:bg-zinc-900">
                <FaGooglePlay className="text-3xl flex-shrink-0" />

                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-400">
                    Get it on
                  </p>

                  <h4 className="text-lg font-semibold">Google Play</h4>
                </div>
              </button>

              <button className="flex items-center gap-4 rounded-2xl border border-zinc-700 px-5 py-4 transition hover:border-orange-500 hover:bg-zinc-900">
                <FaApple className="text-3xl flex-shrink-0" />

                <div className="text-left">
                  <p className="text-[11px] text-zinc-400">Download on the</p>

                  <h4 className="text-lg font-semibold">App Store</h4>
                </div>
              </button>
            </div>

            <p className="mt-6 text-sm text-zinc-500">Be the first to know!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
