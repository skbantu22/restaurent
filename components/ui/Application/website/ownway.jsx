"use client";

import React from "react";
import Image from "next/image";
import { CookingPot, Utensils } from "lucide-react";

export default function BurgerBanner() {
  return (
    <section className="w-full bg-black px-4  md:px-6 lg:px-8">
      <div className="mx-auto max-w-8xl overflow-hidden  border border-zinc-800 bg-[#0b0c0e]">
        <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-3">
          {/* HEADER */}
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="hidden sm:block h-[2px] w-10 bg-[#ff5100]" />

              <h2 className=" text-white text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none">
                Build It Your Way
              </h2>

              <span className="hidden sm:block h-[2px] w-10 bg-[#ff5100]" />
            </div>

            <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-gray-400">
              All burgers & loaded fries are{" "}
              <span className="font-semibold text-[#84cc16]">
                fully customisable
              </span>
            </p>
          </div>

          {/* CONTENT */}
          <div className="relative  grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
            {/* CENTER LINE */}
            <div className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 lg:flex items-center justify-center z-20">
              <div className="relative flex h-full items-center justify-center">
                <div className="absolute h-full border-l border-dashed border-zinc-800" />

                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-800 bg-[#0b0c0e] text-xs font-black tracking-[0.25em] text-zinc-400">
                  OR
                </div>
              </div>
            </div>

            {/* LEFT CARD */}
            <div className="flex flex-col-reverse items-center  lg:flex-row lg:pr-14">
              {/* TEXT */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-3 flex items-center justify-center gap-2 lg:justify-start text-[#ff5100]">
                  <CookingPot className="h-5 w-5" />

                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    Create Your
                  </span>
                </div>

                <h3 className="text-white text-sm sm:text-2xl lg:text-[34px] font-black uppercase leading-none">
                  Own Burger
                </h3>

                <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base lg:mx-0">
                  Choose your patty, cheese, toppings & sauce. Create thousands
                  of flavour combinations exactly how you like it.
                </p>

                <button className="mt-7 w-full rounded-sm bg-[#ff5100] px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#e04700] sm:w-auto">
                  Build Your Burger
                </button>
              </div>

              {/* IMAGE */}
              <div className="relative h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] lg:h-[360px] lg:w-[360px] flex-shrink-0">
                <Image
                  src="/assets/Burgerbottomc.png"
                  alt="Burger"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="flex flex-col-reverse items-center  lg:flex-row lg:pl-14">
              {/* TEXT */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-3 flex items-center justify-center gap-2 lg:justify-start text-[#ff5100]">
                  <Utensils className="h-5 w-5" />

                  <span className=" text-white text-xs font-bold uppercase tracking-[0.2em]">
                    Make It Your
                  </span>
                </div>

                <h3 className=" text-white text-3xl sm:text-4xl lg:text-[34px] font-black uppercase leading-none">
                  Own Meal
                </h3>

                <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base lg:mx-0">
                  Pick any burger, loaded fries and a drink to build the
                  ultimate combo meal and save more.
                </p>

                <button className="mt-7 w-full rounded-sm bg-[#ff5100] px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#e04700] sm:w-auto">
                  Build Your Meal
                </button>
              </div>

              {/* IMAGE */}
              <div className="relative h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] lg:h-[360px] lg:w-[360px] flex-shrink-0">
                <Image
                  src="/assets/snacks.png"
                  alt="Meal Combo"
                  fill
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
