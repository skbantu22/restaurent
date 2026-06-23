"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

import logo from "@/public/assets/logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-[#030303] border-t border-[#111] text-white overflow-hidden">
      <div className="max-w-[1450px] mx-auto">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {/* LOGO BLOCK */}
          <div className="px-6 lg:px-8 py-8 border-b lg:border-b-0 lg:border-r border-[#111]">
            <Image
              src={logo}
              alt="Smashed London"
              width={170}
              height={90}
              priority
              className="w-[150px] lg:w-[170px] h-auto object-contain"
            />

            <p className="mt-5 text-[#6dc242] text-[13px] font-black uppercase tracking-wide">
              100% Halal • East London
            </p>

            <p className="mt-3 text-gray-400 text-[15px] leading-[1.6] font-medium">
              Real ingredients. High heat.
              <br />
              No compromises.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="px-6 lg:px-8 py-8 border-b lg:border-b-0 lg:border-r border-[#111]">
            <h3 className="text-white text-[18px] font-black uppercase mb-6 tracking-wide">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              {["Home", "Menu", "Build Your Own", "Our Story", "Contact"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-gray-300 hover:text-[#ff6b00] transition text-[15px] font-semibold"
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* CONTACT */}
          <div className="px-6 lg:px-8 py-8 border-b lg:border-b-0 lg:border-r border-[#111]">
            <h3 className="text-white text-[18px] font-black uppercase mb-6 tracking-wide">
              Contact
            </h3>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-[#ff6b00] flex-shrink-0"
                  strokeWidth={2.5}
                />

                <span className="text-gray-300 text-[15px] font-semibold">
                  020 7123 4567
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-[#ff6b00] flex-shrink-0"
                  strokeWidth={2.5}
                />

                <span className="text-gray-300 text-[15px] font-semibold">
                  hello@smashedldn.uk
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin
                  size={18}
                  className="text-[#ff6b00] flex-shrink-0"
                  strokeWidth={2.5}
                />

                <span className="text-gray-300 text-[15px] font-semibold">
                  Hackney, East London
                </span>
              </div>
            </div>
          </div>

          {/* DELIVERY */}
          <div className="px-6 lg:px-8 py-8 border-b lg:border-b-0 lg:border-r border-[#111]">
            <h3 className="text-white text-[18px] font-black uppercase mb-6 tracking-wide">
              Delivery Partners
            </h3>

            <div className="flex items-center gap-8 flex-wrap">
              {/* UBER */}
              <div className="leading-none">
                <p className="text-white text-[22px] font-black">Uber</p>

                <p className="text-[#6fda44] text-[22px] font-black mt-1">
                  Eats
                </p>
              </div>

              {/* DELIVEROO */}
              <div className="flex flex-col items-center leading-none">
                <div className="text-[#00d0c7] text-[34px] font-black">↯</div>

                <p className="text-[#00d0c7] text-[15px] font-black lowercase mt-1">
                  deliveroo
                </p>
              </div>

              {/* JUST EAT */}
              <div className="leading-none">
                <div className="text-[#ff7a00] text-[28px] font-black">⌂</div>

                <p className="text-[#ff7a00] text-[15px] font-black uppercase mt-1">
                  Just Eat
                </p>
              </div>
            </div>
          </div>

          {/* OPENING HOURS */}
          <div className="px-6 lg:px-8 py-8">
            <h3 className="text-white text-[18px] font-black uppercase mb-6 tracking-wide">
              Opening Hours
            </h3>

            <p className="text-gray-300 text-[18px] font-semibold">Mon – Sun</p>

            <p className="mt-2 text-white text-[28px] lg:text-[34px] leading-tight font-black">
              12:00 PM – 11:30 PM
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#111] px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-[13px] font-medium text-center sm:text-left">
              © 2024 S'Mashed LDN. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-gray-500 hover:text-white transition text-[13px] font-semibold"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="text-gray-500 hover:text-white transition text-[13px] font-semibold"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
