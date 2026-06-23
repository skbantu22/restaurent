"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";

const menuItems = [
  {
    id: 1,
    productId: "burger-1",
    variantId: "regular",
    title: "Classic Smashed",
    description: "Double smashed beef with cheese, pickles, smash sauce.",
    price: 8.49,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    badge: { text: "Must Try", type: "must-try" },
  },
  {
    id: 2,
    productId: "burger-2",
    variantId: "regular",
    title: "Smoky Bacon Smash",
    description:
      "Double smashed beef with cheese, bacon, jalapeños, smoky sauce.",
    price: 9.49,
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60",
    badge: { text: "New", type: "new" },
  },
  {
    id: 3,
    productId: "burger-3",
    variantId: "regular",
    title: "BBQ Crunch",
    description: "Crispy onions, BBQ sauce, cheddar cheese & smashed beef.",
    price: 10.49,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60",
    badge: { text: "Hot", type: "new" },
  },
  {
    id: 4,
    productId: "burger-4",
    variantId: "regular",
    title: "Cheese Volcano",
    description: "Loaded cheese burger with creamy sauce and crispy fries.",
    price: 11.49,
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60",
    badge: { text: "Popular", type: "must-try" },
  },
  {
    id: 5,
    productId: "burger-5",
    variantId: "regular",
    title: "Mega Smash",
    description:
      "Triple beef patties, melted cheese, onions & signature sauce.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60",
    badge: { text: "Mega", type: "must-try" },
  },
];

export default function MostLovedMenu() {
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(
      addIntoCart({
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      }),
    );
  };

  return (
    <section className="w-full bg-[#0c0c0c] px-3 py-8 sm:px-5 lg:px-8">
      <div className="mx-auto w-full max-w-[1700px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-zinc-100">
              Our Most Loved
            </h2>

            <span className="text-lg text-orange-500">🔥</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/70 bg-[#141414] p-4 transition-all duration-300 hover:border-orange-500/40"
            >
              {/* Badge */}
              {item.badge && (
                <span
                  className={`absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white ${
                    item.badge.type === "must-try"
                      ? "bg-emerald-600"
                      : "bg-red-600"
                  }`}
                >
                  {item.badge.text}
                </span>
              )}

              <div>
                {/* Image */}
                <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Title */}
                <h3 className="mb-1 text-base font-bold text-zinc-100">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="min-h-[42px] text-xs leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4">
                <div className="mb-3 flex justify-end">
                  <span className="text-base font-bold text-orange-500">
                    £{item.price}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-orange-500 py-2.5 text-xs font-bold uppercase tracking-wider text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                >
                  <span className="text-sm">↗</span>
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
