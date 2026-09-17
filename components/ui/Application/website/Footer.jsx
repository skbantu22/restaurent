"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import logo from "@/public/assets/logo-transparent.png";

const FOOTER_GRID_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function formatTime12h(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// Collapses the 7 per-day entries into contiguous ranges that share the
// same hours (e.g. "Mon – Fri: 12:00 PM – 11:00 PM", "Sat – Sun: ...")
// instead of always assuming every day is identical.
function groupOpeningHours(openingHours) {
  if (!Array.isArray(openingHours) || openingHours.length === 0) return [];

  const byDay = Object.fromEntries(openingHours.map((h) => [h.day, h]));
  const ordered = DAY_ORDER.map((d) => byDay[d]).filter(Boolean);
  if (ordered.length === 0) return [];

  const groups = [];
  for (const day of ordered) {
    const key = day.closed ? "closed" : `${day.open}-${day.close}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.days.push(day.day);
    } else {
      groups.push({ key, days: [day.day], closed: day.closed, open: day.open, close: day.close });
    }
  }

  return groups.map((g) => ({
    label:
      g.days.length > 1
        ? `${DAY_LABELS[g.days[0]]} – ${DAY_LABELS[g.days[g.days.length - 1]]}`
        : DAY_LABELS[g.days[0]],
    hours: g.closed ? "Closed" : `${formatTime12h(g.open)} – ${formatTime12h(g.close)}`,
  }));
}

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get("/api/settings/public")
      .then(({ data }) => data?.success && setSettings(data.data))
      .catch(() => {}); // falls back to the defaults below
  }, []);

  const phone = settings?.phone || "020 7123 4567";
  const email = settings?.email || "hello@smashedldn.uk";
  const address = settings?.address || "Hackney, East London";
  const hourGroups = groupOpeningHours(settings?.openingHours);

  return (
    <footer className="w-full bg-[#030303] border-t border-[#111] text-white overflow-hidden">
      <div className="max-w-[1450px] mx-auto">
        {/* MAIN FOOTER */}
        <motion.div
          variants={FOOTER_GRID_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
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

          {/* CONTACT */}
          <div
            id="contact"
            className="px-6 lg:px-8 py-8 border-b lg:border-b-0 lg:border-r border-[#111] scroll-mt-24"
          >
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

            <div className="flex items-center gap-5 flex-wrap">
              {/* UBER */}
              <Image
                src="/assets/uber-eats.png"
                alt="Uber Eats"
                width={192}
                height={192}
                className="w-16 h-16 object-contain"
              />

              {/* DELIVEROO */}
              <Image
                src="/assets/deliveroo-logo.png"
                alt="Deliveroo"
                width={192}
                height={192}
                className="w-16 h-16 object-contain"
              />

              {/* JUST EAT */}
              <Image
                src="/assets/just-eat.png"
                alt="Just Eat"
                width={192}
                height={192}
                className="w-16 h-16 object-contain"
              />
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
        </motion.div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#111] px-6 lg:px-8 pt-5 pb-[calc(1.25rem+4rem+env(safe-area-inset-bottom))] lg:pb-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-[13px] font-medium text-center sm:text-left">
              © 2024 S&apos;Mashed LDN. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="inline-block py-2.5 text-gray-500 hover:text-white transition text-[13px] font-semibold"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="inline-block py-2.5 text-gray-500 hover:text-white transition text-[13px] font-semibold"
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
