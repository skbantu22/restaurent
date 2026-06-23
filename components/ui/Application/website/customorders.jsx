"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { toast } from "sonner";

// ---------------- ICONS ----------------
const ICONS = {
  beef: (
    <svg
      className="w-9 h-9 transition-transform group-hover:scale-110 duration-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M12 28c0-8 8-12 20-12s20 4 20 12v4H12v-4z"
        strokeLinecap="round"
      />
      <path
        d="M10 38h44v4c0 6-6 10-22 10S10 48 10 42v-4z"
        strokeLinecap="round"
      />
      <path d="M14 32h36" strokeDasharray="3 3" />
    </svg>
  ),

  chicken: (
    <svg
      className="w-9 h-9 transition-transform group-hover:scale-110 duration-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M46 14c-6-6-16-4-22 2-4 4-6 10-4 16l-12 12c-2 2-2 6 0 8s6 2 8 0l12-12c6 2 12 0 16-4 6-6 8-16 2-22z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  lamb: (
    <svg
      className="w-9 h-9 transition-transform group-hover:scale-110 duration-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M20 20c10-10 26-4 28 8s-6 20-16 22S10 30 20 20z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 42L10 54" strokeLinecap="round" />
    </svg>
  ),

  plant: (
    <svg
      className="w-9 h-9 transition-transform group-hover:scale-110 duration-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        d="M32 50V22M32 26c6-6 14-6 16 2s-6 12-16 14M32 32c-6-6-14-6-16 2s6 12 16 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ---------------- BASE ----------------
const BASE_OPTIONS = [
  { id: "beef", label: "Beef", price: 8.99, icon: ICONS.beef },
  { id: "chicken", label: "Chicken", price: 7.99, icon: ICONS.chicken },
  { id: "lamb", label: "Lamb", price: 9.99, icon: ICONS.lamb },
  { id: "plant", label: "Plant Based", price: 6.99, icon: ICONS.plant },
];

// ---------------- EXTRAS ----------------
const EXTRA_OPTIONS = [
  {
    id: "bacon",
    label: "Bacon",
    price: 1.5,
    img: "/assets/Custom/bacon.png",
  },

  {
    id: "jalapenos",
    label: "Jalapeños",
    price: 0.8,
    img: "/assets/Custom/jalapenos.png",
  },

  {
    id: "onions",
    label: "Fried Onions",
    price: 0.7,
    img: "/assets/Custom/onions.png",
  },
];

// ---------------- DRINKS ----------------
const DRINK_OPTIONS = [
  {
    id: "coke",
    label: "Coke Zero",
    price: 1.5,
    img: "/assets/Custom/water.png",
  },

  {
    id: "water",
    label: "Water",
    price: 1.0,
    img: "/assets/Custom/water.png",
  },

  {
    id: "sprite",
    label: "Sprite Zero",
    price: 1.5,
    img: "/assets/Custom/sprite.png",
  },

  {
    id: "redbull",
    label: "Red Bull",
    price: 2.5,
    img: "/assets/Custom/redbull.png",
  },
];

export default function PremiumMealBuilder() {
  const dispatch = useDispatch();

  const [base, setBase] = useState(null);
  const [extras, setExtras] = useState([]);
  const [drink, setDrink] = useState(null);

  const toggleExtra = (id) => {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectedBase = useMemo(
    () => BASE_OPTIONS.find((x) => x.id === base),
    [base],
  );

  const selectedDrink = useMemo(
    () => DRINK_OPTIONS.find((x) => x.id === drink),
    [drink],
  );

  const selectedExtras = useMemo(
    () => EXTRA_OPTIONS.filter((x) => extras.includes(x.id)),
    [extras],
  );

  const basePrice = selectedBase?.price || 0;
  const drinkPrice = selectedDrink?.price || 0;

  const extrasPrice = selectedExtras.reduce((sum, item) => sum + item.price, 0);

  const total = basePrice + drinkPrice + extrasPrice;

  const totalItems =
    (selectedBase ? 1 : 0) + selectedExtras.length + (selectedDrink ? 1 : 0);

  const progress = (totalItems / 6) * 100;

  const hasSelection = totalItems > 0;

  const handleAddToCart = () => {
    if (!hasSelection) return;

    const cartItem = {
      productId: "custom-meal",
      variantId: `${base || "none"}-${drink || "none"}`,
      quantity: 1,
      base: selectedBase || null,
      extras: selectedExtras,
      drink: selectedDrink || null,
      total,
    };

    dispatch(addIntoCart(cartItem));

    console.log(cartItem);
  };
  const clearSelection = () => {
    if (!base && extras.length === 0 && !drink) {
      toast.error("Nothing to clear");
      return;
    }

    const removed = [];

    if (base) removed.push("base");
    if (extras.length) removed.push("extras");
    if (drink) removed.push("drink");

    setBase(null);
    setExtras([]);
    setDrink(null);

    toast.success(`Cleared: ${removed.join(", ")}`);
  };
  return (
    <div className=" bg-[#050505] text-white border border-zinc-800 ">
      <div className="">
        {/* HEADER */}

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 border-2 border-[#1f1f1f] rounded-sm overflow-hidden  ">
          {/* BASE */}
          <div className="bg-[#050505] p-6 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,201,67,0.12),transparent_40%)] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-center gap-4 mb-10 relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#7ac943] flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(122,201,67,0.4)]">
                1
              </div>

              <h2 className="text-white uppercase tracking-widest font-extrabold text-lg">
                Choose Your Base
              </h2>
            </div>

            {/* Items */}
            <div className="flex items-center justify-center gap-5 relative z-10">
              {/* Beef */}
              <button
                onClick={() => setBase("beef")}
                className={`group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${
                  base === "beef" ? "scale-110" : ""
                }`}
              >
                <div
                  className={`transition-all duration-300 ${
                    base === "beef"
                      ? "text-[#7ac943] drop-shadow-[0_0_12px_rgba(122,201,67,0.7)]"
                      : "text-white group-hover:text-[#7ac943]"
                  }`}
                >
                  <svg
                    className="w-18 h-18"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M12 28c0-8 8-12 20-12s20 4 20 12v4H12v-4z"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 38h44v4c0 6-6 10-22 10S10 48 10 42v-4z"
                      strokeLinecap="round"
                    />
                    <path d="M14 32h36" strokeDasharray="3 3" />
                  </svg>
                </div>

                <span
                  className={`text-xs font-bold tracking-wider uppercase ${
                    base === "beef" ? "text-[#7ac943]" : "text-white"
                  }`}
                >
                  Beef
                </span>
              </button>

              {/* Chicken */}
              <button
                onClick={() => setBase("chicken")}
                className={`group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${
                  base === "chicken" ? "scale-110" : ""
                }`}
              >
                <div
                  className={`transition-all duration-300 ${
                    base === "chicken"
                      ? "text-[#7ac943] drop-shadow-[0_0_12px_rgba(122,201,67,0.7)]"
                      : "text-white group-hover:text-[#7ac943]"
                  }`}
                >
                  <svg
                    className="w-18 h-18"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M46 14c-6-6-16-4-22 2-4 4-6 10-4 16l-12 12c-2 2-2 6 0 8s6 2 8 0l12-12c6 2 12 0 16-4 6-6 8-16 2-22z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span
                  className={`text-xs font-bold tracking-wider uppercase ${
                    base === "chicken" ? "text-[#7ac943]" : "text-white"
                  }`}
                >
                  Chicken
                </span>
              </button>

              {/* Lamb */}
              <button
                onClick={() => setBase("lamb")}
                className={`group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${
                  base === "lamb" ? "scale-110" : ""
                }`}
              >
                <div
                  className={`transition-all duration-300 ${
                    base === "lamb"
                      ? "text-[#7ac943] drop-shadow-[0_0_12px_rgba(122,201,67,0.7)]"
                      : "text-white group-hover:text-[#7ac943]"
                  }`}
                >
                  <svg
                    className="w-18 h-18"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M20 20c10-10 26-4 28 8s-6 20-16 22S10 30 20 20z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M22 42L10 54" strokeLinecap="round" />
                  </svg>
                </div>

                <span
                  className={`text-xs font-bold tracking-wider uppercase ${
                    base === "lamb" ? "text-[#7ac943]" : "text-white"
                  }`}
                >
                  Lamb
                </span>
              </button>

              {/* Plant Based */}
              <button
                onClick={() => setBase("plant")}
                className={`group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${
                  base === "plant" ? "scale-110" : ""
                }`}
              >
                <div
                  className={`transition-all duration-300 ${
                    base === "plant"
                      ? "text-[#7ac943] drop-shadow-[0_0_12px_rgba(122,201,67,0.7)]"
                      : "text-white group-hover:text-[#7ac943]"
                  }`}
                >
                  <svg
                    className="w-18 h-18"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M32 50V22M32 26c6-6 14-6 16 2s-6 12-16 14M32 32c-6-6-14-6-16 2s6 12 16 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span
                  className={`text-xs font-bold tracking-wider uppercase text-center leading-tight ${
                    base === "plant" ? "text-[#7ac943]" : "text-white"
                  }`}
                >
                  Plant <br /> Based
                </span>
              </button>
            </div>

            {/* Right Border Accent */}
            <div className="absolute top-6 right-4 h-[75%] border-r border-dashed border-white/60" />
          </div>

          {/* EXTRAS */}
          <div className="bg-[#050505] p-6 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,201,67,0.12),transparent_40%)] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-center gap-4 mb-1 relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#7ac943] flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(122,201,67,0.4)]">
                2
              </div>

              <h2 className="text-white uppercase tracking-widest font-extrabold text-lg">
                Choose Extras
              </h2>
            </div>

            {/* ITEMS */}
            <div className="flex flex-wrap items-center justify-center gap-5 relative z-10">
              {EXTRA_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleExtra(item.id)}
                  className={`group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 ${
                    extras.includes(item.id) ? "scale-105" : ""
                  }`}
                >
                  {/* IMAGE BOX */}
                  <div
                    className={`relative w-28 h-40 flex items-center justify-center  transition-all duration-300 ${
                      extras.includes(item.id)
                        ? "bg-[#7ac943]/10 border border-[#7ac943]/40 shadow-[0_0_20px_rgba(122,201,67,0.3)]"
                        : "bg-transparent border border-transparent"
                    }`}
                  >
                    <Image
                      src={item.img}
                      alt={item.label}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* LABEL */}
                  <span
                    className={`text-xs font-black uppercase leading-none tracking-wider text-center transition-all duration-300 ${
                      extras.includes(item.id) ? "text-[#7ac943]" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* PRICE */}
                  <span className="text-[11px] text-orange-500 font-semibold">
                    +£{item.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>

            {/* RIGHT BORDER */}
            <div className="absolute top-6 right-4 h-[75%] border-r border-dashed border-white/60" />
          </div>

          {/* DRINKS */}
          {/* DRINKS */}
          <div className="bg-[#050505] p-6 relative overflow-hidden rounded-xl">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,201,67,0.12),transparent_40%)] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-center gap-4 mb-5 relative z-10">
              <div className="w-9 h-9 rounded-full bg-[#7ac943] flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(122,201,67,0.4)]">
                3
              </div>

              <h2 className="text-white uppercase tracking-widest font-extrabold text-lg">
                Choose Your Drinks
              </h2>
            </div>

            {/* ITEMS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
              {DRINK_OPTIONS.map((item) => {
                const active = drink === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setDrink((prev) => (prev === item.id ? null : item.id))
                    }
                    className={`group relative flex flex-col items-center justify-between h-[170px] p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      active
                        ? "border-[#7ac943] bg-[#0d0d0d] shadow-[0_0_25px_rgba(122,201,67,0.18)] scale-105"
                        : "border-white/5 bg-white/[0.02] hover:border-[#7ac943]/30"
                    }`}
                  >
                    {/* IMAGE */}
                    <div
                      className={`relative w-24 h-24 flex items-center justify-center transition-all duration-300 ${
                        active
                          ? "drop-shadow-[0_0_18px_rgba(122,201,67,0.7)]"
                          : "group-hover:scale-105"
                      }`}
                    >
                      <Image
                        src={item.img}
                        alt={item.label}
                        fill
                        sizes="100px"
                        className="object-contain"
                      />
                    </div>

                    {/* TEXT */}
                    <div className="flex flex-col items-center gap-1 min-h-[38px]">
                      {/* LABEL */}
                      <span
                        className={`text-xs font-black uppercase tracking-[0.18em] text-center leading-tight transition-all duration-300 ${
                          active ? "text-[#7ac943]" : "text-white"
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* PRICE */}
                      <span className="text-[11px] text-orange-500 font-semibold">
                        +£{item.price.toFixed(2)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BILL */}
        {/* BILL */}
        {/* BILL */}
        <div
          className={`transition-all duration-700 ease-out transform origin-top overflow-hidden ${
            hasSelection
              ? "max-h-[1000px] opacity-100 scale-100 translate-y-0 mt-6"
              : "max-h-0 opacity-0 scale-95 -translate-y-2 mt-0"
          }`}
        >
          <div className="bg-neutral-950 border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl">
            {/* TOP */}
            <div className="border-b border-yellow-500/20 px-6 py-5 flex justify-between items-center">
              <h4 className="uppercase tracking-[0.25em] text-xs text-yellow-400 font-black">
                Live Order Summary
              </h4>

              <div className="flex items-center gap-2">
                <div className="bg-black border border-yellow-500/30 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-yellow-300">
                  {totalItems} items
                </div>

                {/* CLEAR ALL */}
                <button
                  onClick={clearSelection}
                  className="text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500 hover:text-black transition-all duration-300 active:scale-95"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* ITEMS */}
            <div className="p-6 space-y-4">
              {/* BASE */}
              {selectedBase && (
                <div className="flex justify-between items-center text-sm bg-neutral-900/40 px-4 py-3 rounded-xl border border-neutral-800 hover:border-yellow-500/30 transition">
                  <span className="text-neutral-300">
                    Base →{" "}
                    <strong className="text-yellow-300">
                      {selectedBase.label}
                    </strong>
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white">
                      £{selectedBase.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() => setBase(null)}
                      className="text-red-400 hover:text-red-300 text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* EXTRAS */}
              {selectedExtras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex justify-between items-center text-sm pl-4 bg-neutral-900/20 px-4 py-3 rounded-xl border border-neutral-800 hover:border-yellow-500/20 transition"
                >
                  <span className="text-neutral-400">
                    + <span className="text-white">{extra.label}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-300">
                      £{extra.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() =>
                        setExtras((prev) => prev.filter((x) => x !== extra.id))
                      }
                      className="text-red-400 hover:text-red-300 text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {/* DRINK */}
              {selectedDrink && (
                <div className="flex justify-between items-center text-sm bg-neutral-900/40 px-4 py-3 rounded-xl border border-neutral-800 hover:border-yellow-500/30 transition">
                  <span className="text-neutral-300">
                    Drink →{" "}
                    <strong className="text-yellow-300">
                      {selectedDrink.label}
                    </strong>
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white">
                      £{selectedDrink.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() => setDrink(null)}
                      className="text-red-400 hover:text-red-300 text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* EMPTY STATE */}
              {!selectedBase &&
                selectedExtras.length === 0 &&
                !selectedDrink && (
                  <div className="text-center text-neutral-600 text-sm py-6">
                    Build your meal to see summary
                  </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-yellow-500/20 bg-black/60 px-6 py-5 flex flex-col md:flex-row gap-5 items-center justify-between">
              <div>
                <p className="uppercase tracking-[0.25em] text-[10px] text-yellow-400 font-black">
                  Total Cost
                </p>

                <h2 className="text-4xl font-black mt-2 text-white">
                  £{total.toFixed(2)}
                </h2>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!hasSelection}
                className={`w-full md:w-auto font-black px-10 py-4 rounded-2xl transition-all duration-300 active:scale-95 shadow-[0_10px_40px_rgba(250,204,21,0.25)] ${
                  hasSelection
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
