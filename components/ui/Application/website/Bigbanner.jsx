"use client";

export default function BurgerHero() {
  return (
    <section className="relative bg-black lg:min-h-[500px] lg:h-[500px] flex items-center px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden lg:py-0">
      {/* Premium Ambient Light Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-[35%] lg:top-1/2 lg:-translate-y-1/2 w-[300px] sm:w-[450px] lg:w-[500px] h-[300px] sm:h-[450px] bg-orange-600/15 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,90,0,0.1),transparent_60%)] lg:bg-[radial-gradient(circle_at_75%_50%,rgba(255,90,0,0.12),transparent_40%)] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">
        {/* MOBILE SHOWCASE CONTAINER (Hidden on mobile via hidden md:block, positioned properly for PC) */}
        <div className="relative order-1 lg:order-2 w-full max-w-[320px] sm:max-w-[420px] lg:max-w-none lg:w-[48%] lg:absolute lg:right-[-2%] xl:right-[0%] lg:top-1/2 lg:-translate-y-1/2 flex justify-center items-center my-2 lg:my-0 hidden md:block">
          {/* Main Burger Image Assembly */}
          <div className="relative w-full flex justify-center items-center">
            <img
              src="/assets/Burgers.png"
              alt="London's Finest Smash Burger"
              className="w-[85%] sm:w-full h-auto max-h-[280px] sm:max-h-[380px] lg:max-h-none lg:h-[480px] xl:h-[540px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] lg:drop-shadow-[0_35px_60px_rgba(0,0,0,0.95)] relative z-10"
            />
            {/* Darker Floor Shadow Reflection */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[75%] h-4 bg-orange-500/10 blur-xl rounded-full z-0" />
          </div>

          {/* HIGH-FIDELITY FLOATING HALAL BADGE */}
          <div className="absolute top-0 right-2 sm:right-4 lg:right-[4%] xl:right-[8%] z-25 hidden lg:flex flex-col items-center justify-center border border-[#1b4324] bg-[#051409]/85 backdrop-blur-md rounded-none p-2 sm:p-3 w-16 sm:w-24 shadow-2xl">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-none border border-[#2e8b41] flex items-center justify-center bg-black/40 mb-0.5 sm:mb-1">
              <span
                className="text-[#3cd060] font-bold text-[10px] sm:text-xs"
                lang="ar"
              >
                حلال
              </span>
            </div>
            <span className="text-[#3cd060] text-[7px] sm:text-[8px] font-black tracking-[0.2em] uppercase hidden sm:inline">
              Halal
            </span>
            <div className="w-full border-t border-gray-800/80 my-1 sm:my-2 hidden sm:block" />
            <div className="text-center flex flex-col items-center">
              <span className="text-white text-[9px] sm:text-[11px] font-black tracking-wider leading-none">
                100%
              </span>
              <span className="text-white text-[8px] sm:text-[10px] font-black tracking-wider leading-tight uppercase mt-0.5">
                Halal
              </span>
              <span className="text-gray-400 text-[6px] sm:text-[7px] font-bold tracking-widest uppercase mt-0.5 hidden sm:inline">
                Certified
              </span>
            </div>
          </div>
        </div>

        {/* TYPOGRAPHY & INTERACTIVE ACTIONS */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left mt-2 lg:mt-0">
          {/* Tagline */}
          <p className="text-[#32b768] text-[10px] sm:text-xs md:text-sm tracking-[0.25em] font-black mb-2.5 sm:mb-4 uppercase">
            100% HALAL • FRESHLY SMASHED
          </p>

          {/* Title */}
          <h1 className="font-black leading-[0.92] sm:leading-[0.9] text-white text-4xl sm:text-6xl md:text-7xl lg:text-[70px] xl:text-[76px] tracking-tight uppercase">
            London’s
            <br />
            Finest
            <br />
            <span className="text-[#ff5a00] hidden md:block">
              Smash Burgers
            </span>
            <span className="text-[#ff5a00] block md:hidden">
              Smash <br />
              Burgers
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 sm:mt-6 text-gray-400 sm:text-gray-300 mx-auto lg:mx-0 max-w-xs sm:max-w-sm text-xs sm:text-sm md:text-base font-medium leading-relaxed opacity-95">
            Real ingredients. High heat.
            <br />
            Perfect crust. No compromises.
          </p>

          {/* Action Buttons Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
            <button className="w-auto px-5 py-2.5 sm:px-8 sm:py-4 bg-[#ff5a00] hover:bg-[#e04f00] text-white font-extrabold rounded-none text-xs md:text-sm tracking-wider flex items-center justify-center gap-2 transition-colors uppercase shadow-[0_4px_20px_rgba(255,90,0,0.2)]">
              ORDER NOW <span>→</span>
            </button>

            <button className="w-full sm:w-auto px-6 py-3.5 sm:py-4 border border-[#262626] sm:border-[#333333] hover:border-gray-500 text-white font-extrabold rounded-none text-xs md:text-sm tracking-wider flex items-center justify-center gap-2 bg-white/[0.02] sm:bg-black/40 transition-colors uppercase">
              Build Your Meal
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 3c-4.97 0-9 1.79-9 4.002V10c0 2.212 4.03 4.002 9 4.002s9-1.79 9-4.002V7.002C21 4.792 16.97 3 12 3zM3 10v4c0 2.212 4.03 4.002 9 4.002s9-1.79 9-4.002v-4M3 14v4c0 2.212 4.03 4.002 9 4.002s9-1.79 9-4.002v-4"
                />
              </svg>
            </button>
          </div>

          {/* Footer Logistics / Partners */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-y-2 gap-x-4 mt-8 sm:mt-10 lg:mt-12 text-[11px] sm:text-xs font-bold text-gray-400">
            <div className="flex items-center gap-4">
              <span className="text-white font-black tracking-wide">
                Uber Eats
              </span>
              <span className="text-[#00cdbc] lowercase font-extrabold">
                deliveroo
              </span>
              <span className="text-[#ff8000] uppercase font-black">
                Just Eat
              </span>
            </div>
            <span className="text-gray-400 sm:text-gray-500 font-medium tracking-wide sm:border-l sm:border-gray-800 sm:pl-4">
              Fast Delivery in East London
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
