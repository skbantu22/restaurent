"use client";

import { ShieldCheck, Beef, Flame, Truck, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={42} strokeWidth={2.2} />,
    title: "100% HALAL\nCERTIFIED",
    description: "All our meat and ingredients are 100% Halal certified.",
    color: "text-[#85c441]",
  },
  {
    icon: <Beef size={42} strokeWidth={2.2} />,
    title: "PREMIUM\nQUALITY MEAT",
    description: "Only the best Halal cuts, never frozen.",
    color: "text-[#ff6b00]",
  },
  {
    icon: <Flame size={42} strokeWidth={2.2} />,
    title: "FRESHLY\nSMASHED",
    description: "Smashed fresh to order for maximum flavour.",
    color: "text-[#ff6b00]",
  },
  {
    icon: <Truck size={42} strokeWidth={2.2} />,
    title: "FAST &\nRELIABLE",
    description: "Quick delivery across East London.",
    color: "text-[#85c441]",
  },
  {
    icon: <HeartHandshake size={42} strokeWidth={2.2} />,
    title: "MADE WITH\nPASSION",
    description: "London's finest burgers made with love.",
    color: "text-[#ff6b00]",
  },
];

export default function WhySmashed() {
  return (
    <section className="bg-[#050505]  px-4">
      <div className="max-w-8xl  mx-auto">
        <div className="relative overflow-hidden  border border-[#1c2b12] bg-[#071207]">
          {/* GREEN GLOW */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row">
            {/* LEFT CONTENT */}
            <div className="flex-1 p-6 lg:p-10">
              {/* TITLE */}
              <h2 className="text-white text-2xl lg:text-3xl font-black uppercase tracking-wide">
                Why S’Mashed LDN?
              </h2>

              {/* FEATURE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mt-8">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#0b1809] border border-[#1f2d1a] rounded-xl p-5 min-h-[220px] flex flex-col"
                  >
                    {/* ICON */}
                    <div className={`${item.color}`}>{item.icon}</div>

                    {/* TITLE */}
                    <h3 className="mt-5 text-white text-[20px] leading-tight font-black uppercase whitespace-pre-line">
                      {item.title}
                    </h3>

                    {/* DESC */}
                    <p className="mt-4 text-gray-400 text-[15px] leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT HALAL BADGE */}
            {/* RIGHT HALAL BADGE */}
            <div className="w-full lg:w-[360px] flex items-center justify-center p-8 lg:p-10">
              <div className="relative w-[240px] h-[240px] lg:w-[280px] lg:h-[280px] rounded-full border-[6px] border-[#6d9f2f] flex items-center justify-center shadow-[0_0_25px_rgba(109,159,47,0.2)]">
                {/* OUTER TEXT GLOW RING */}
                <div className="absolute inset-2 rounded-full border border-[#6d9f2f]/40" />

                {/* INNER CIRCLE (Containing all elements) */}
                <div className="w-[200px] h-[200px] lg:w-[220px] lg:h-[220px] rounded-full border-[4px] border-[#6d9f2f] flex flex-col items-center justify-center text-center p-2 relative bg-zinc-950/40">
                  {/* TOP TEXT */}
                  <span className="text-[#85c441] text-[11px] lg:text-xs font-black uppercase tracking-[0.15em] mb-0.5">
                    100% Halal
                  </span>

                  {/* ARABIC */}
                  <span
                    lang="ar"
                    className="text-[#85c441] text-4xl lg:text-5xl font-black leading-none my-1"
                  >
                    حلال
                  </span>

                  {/* MAIN TEXT */}
                  <span className="text-[#85c441] text-sm lg:text-base font-black uppercase tracking-wide leading-none mb-1">
                    Halal
                  </span>

                  {/* BOTTOM TEXT */}
                  <span className="text-[#85c441] text-[10px] lg:text-[11px] font-black uppercase tracking-[0.18em]">
                    Certified
                  </span>

                  {/* STARS (Positioned symmetrically inside the inner ring) */}
                  <div className="absolute w-full px-4 flex justify-between items-center pointer-events-none text-[#85c441] text-sm lg:text-base">
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
