"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Triple Smashed",
    desc: "Triple beef, cheese, pickles, onions, smash sauce",
    price: "£10.99",
    image: "/assets/smash-burgerss.png",
    link: "/menu/triple-smashed",
  },
  {
    title: "Chicken Smashed",
    desc: "Smashed chicken, cheese, lettuce, mayo",
    price: "£8.99",
    image: "/assets/smash-burgerss.png",
    link: "/menu/chicken-smashed",
  },
  {
    title: "Loaded Fries",
    desc: "Fries, cheese sauce, bacon, jalapeños",
    price: "£6.49",
    image: "/assets/loaded-fries.png",
    link: "/menu/loaded-fries",
  },
  {
    title: "Chicken & Waffles",
    desc: "Smashed chicken, waffle, maple syrup",
    price: "£9.49",
    image: "/assets/chicken-wallfies.png",
    link: "/menu/chicken-waffles",
  },
  {
    title: "Smash & Loaded",
    desc: "Smashed beef, cheese, loaded fries inside",
    price: "£11.49",
    image: "/assets/smash-loadeds.png",
    link: "/menu/smash-loaded",
  },
  {
    title: "Cheesecake",
    desc: "Creamy cheesecake with biscuit base",
    price: "£3.49+",
    image: "/assets/chese-cake.png",
    link: "/menu/cheesecake",
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-black  px-3 md:px-6">
      {/* Header */}
      <div className="max-w-8xl mx-auto flex items-center gap-3 mb-3">
        <h2 className="text-white text-sm md:text-2xl font-extrabold uppercase tracking-wide">
          OUR <span className="text-orange-500">MENU</span>
        </h2>

        <div className="h-[2px] w-16 bg-orange-500"></div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-8xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="group bg-[#0d0d0d] border border-zinc-800 rounded-md overflow-hidden hover:border-orange-500/40 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-[160px] md:h-[180px] overflow-hidden bg-black">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col min-h-[145px]">
              <h3 className="text-white text-sm md:text-[15px] font-bold leading-tight mb-2">
                {item.title}
              </h3>

              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed flex-grow">
                {item.desc}
              </p>

              {/* Price */}
              <div className="mt-4">
                <span className="text-orange-500 font-bold text-lg">
                  {item.price}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
