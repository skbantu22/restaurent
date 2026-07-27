"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { toast } from "sonner";
import { X, Plus, Loader2, Flame, Check } from "lucide-react";

// ---------------- ICONS (Enlarged) ----------------
const ICONS = {
  beef: (
    <svg
      className="w-16 h-16 md:w-20 md:h-20 transition-transform group-hover:scale-110 duration-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
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
      className="w-16 h-16 md:w-20 md:h-20 transition-transform group-hover:scale-110 duration-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path
        d="M46 14c-6-6-16-4-22 2-4 4-6 10-4 16l-12 12c-2 2-2 6 0 8s6 2 8 0l12-12c6 2 12 0 16-4 6-6 8-16 2-22z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  plant: (
    <svg
      className="w-16 h-16 md:w-20 md:h-20 transition-transform group-hover:scale-110 duration-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path
        d="M32 50V22M32 26c6-6 14-6 16 2s-6 12-16 14M32 32c-6-6-14-6-16 2s6 12 16 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ---------------- BASE CATEGORIES ----------------
const BASE_OPTIONS = [
  { id: "beef", label: "Beef", icon: ICONS.beef },
  { id: "chicken", label: "Chicken", icon: ICONS.chicken },
  { id: "plant", label: "Plant Based", icon: ICONS.plant },
];

// ---------------- EXTRAS ----------------
const EXTRA_OPTIONS = [
  { id: "bacon", label: "Bacon", price: 1.5, img: "/assets/Custom/bacon.png" },
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
  { id: "water", label: "Water", price: 1.0, img: "/assets/Custom/water.png" },
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
  const [drinks, setDrinks] = useState([]);
  const [activeModalBase, setActiveModalBase] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  const [categoryProducts, setCategoryProducts] = useState({
    beef: [],
    chicken: [],
    plant: [],
  });
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    async function fetchFilteredProducts() {
      try {
        setLoadingProducts(true);

        const [beefRes, chickenRes, plantRes] = await Promise.all([
          fetch("/api/product/filter?type=beef")
            .then((res) => res.json())
            .catch(() => ({ products: [] })),
          fetch("/api/product/filter?type=chicken")
            .then((res) => res.json())
            .catch(() => ({ products: [] })),
          fetch("/api/product/filter?type=plant")
            .then((res) => res.json())
            .catch(() => ({ products: [] })),
        ]);

        setCategoryProducts({
          beef: beefRes.products || [],
          chicken: chickenRes.products || [],
          plant: plantRes.products || [],
        });
      } catch (error) {
        console.error("Failed to fetch filtered products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchFilteredProducts();
  }, []);

  const toggleExtra = (id) => {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleDrink = (id) => {
    setDrinks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectedDrinks = useMemo(
    () => DRINK_OPTIONS.filter((x) => drinks.includes(x.id)),
    [drinks],
  );

  const selectedExtras = useMemo(
    () => EXTRA_OPTIONS.filter((x) => extras.includes(x.id)),
    [extras],
  );

  const drinksPrice = selectedDrinks.reduce((sum, item) => sum + item.price, 0);
  const extrasPrice = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const productsPrice = cartProducts.reduce(
    (sum, item) =>
      sum + (item.sellingPrice || item.price || 0) * (item.quantity || 1),
    0,
  );

  const total = drinksPrice + extrasPrice + productsPrice;
  const totalItems =
    selectedExtras.length + selectedDrinks.length + cartProducts.length;
  const hasSelection = totalItems > 0;

  const handleBaseClick = (baseId) => {
    setActiveModalBase(baseId);
  };

  const isProductInCart = (prodId) => {
    return cartProducts.some(
      (item) => String(item.productId || item._id) === String(prodId),
    );
  };

  const handleToggleProductCart = (prod) => {
    const prodId = prod._id || prod.productId || "";
    if (isProductInCart(prodId)) {
      setCartProducts((prev) =>
        prev.filter(
          (item) => String(item.productId || item._id) !== String(prodId),
        ),
      );
      toast.info(`Removed ${prod.name} from selection`);
    } else {
      setCartProducts((prev) => [
        ...prev,
        { ...prod, productId: prodId, quantity: 1 },
      ]);
      toast.success(`Added ${prod.name} to selection`);
    }
  };

  const handleAddToCart = () => {
    if (!hasSelection) return;

    selectedExtras.forEach((extra) => {
      dispatch(
        addIntoCart({
          productId: `extra-${extra.id}`,
          name: extra.label,
          sellingPrice: extra.price,
          price: extra.price,
          quantity: 1,
          image: extra.img,
        }),
      );
    });

    selectedDrinks.forEach((drink) => {
      dispatch(
        addIntoCart({
          productId: `drink-${drink.id}`,
          name: drink.label,
          sellingPrice: drink.price,
          price: drink.price,
          quantity: 1,
          image: drink.img,
        }),
      );
    });

    cartProducts.forEach((prod) => {
      dispatch(
        addIntoCart({
          productId: prod.productId || prod._id,
          name: prod.name,
          sellingPrice: prod.sellingPrice || prod.price,
          price: prod.price || prod.sellingPrice,
          quantity: prod.quantity || 1,
          media: prod.media,
        }),
      );
    });

    toast.success("Items added to cart successfully!");
  };

  const clearSelection = () => {
    if (!hasSelection) {
      toast.error("Nothing to clear");
      return;
    }

    setBase(null);
    setExtras([]);
    setDrinks([]);
    setCartProducts([]);
    toast.success("Cleared all selections");
  };

  return (
    <div className="bg-[#050505] text-white border border-zinc-800 p-4 md:p-6 rounded-none">
      <div className="max-w-7xl mx-auto">
        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 border border-[#1f1f1f] rounded-none overflow-hidden">
          {/* BASE CATEGORIES */}
          <div className="bg-[#050505] p-6 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1f1f1f]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,201,67,0.12),transparent_40%)] pointer-events-none" />

            <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
              <div className="w-9 h-9 rounded-none bg-[#7ac943] flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(122,201,67,0.4)]">
                1
              </div>
              <h2 className="text-white uppercase tracking-widest font-extrabold text-lg">
                Choose Category
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 relative z-10">
              {BASE_OPTIONS.map((item) => {
                const active = base === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setBase(item.id);
                      handleBaseClick(item.id);
                    }}
                    className={`group flex flex-col items-center justify-center gap-3 py-6 px-2 rounded-none outline outline-1 transition-all duration-300 hover:scale-105 ${
                      active
                        ? "outline-[#7ac943] bg-[#7ac943]/10 shadow-[0_0_20px_rgba(122,201,67,0.3)] scale-105"
                        : "outline-white/5 bg-white/[0.02] hover:outline-[#7ac943]/30"
                    }`}
                  >
                    <div
                      className={`transition-all duration-300 ${
                        active
                          ? "text-[#7ac943]"
                          : "text-white group-hover:text-[#7ac943]"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-xs md:text-sm font-bold tracking-wider uppercase text-center ${
                        active ? "text-[#7ac943]" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EXTRAS */}
          <div className="bg-[#050505] p-6 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1f1f1f]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,201,67,0.12),transparent_40%)] pointer-events-none" />

            <div className="flex items-center justify-center gap-4 mb-5 relative z-10">
              <div className="w-9 h-9 rounded-none bg-[#7ac943] flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(122,201,67,0.4)]">
                2
              </div>
              <h2 className="text-white uppercase tracking-widest font-extrabold text-lg">
                Choose Extras
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              {EXTRA_OPTIONS.map((item) => {
                const isSelected = extras.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleExtra(item.id)}
                    className={`group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 ${
                      isSelected ? "scale-105" : ""
                    }`}
                  >
                    <div
                      className={`relative w-20 h-28 flex items-center justify-center transition-all duration-300 rounded-none outline outline-1 ${
                        isSelected
                          ? "bg-[#7ac943]/10 outline-[#7ac943] shadow-[0_0_20px_rgba(122,201,67,0.3)]"
                          : "outline-white/5"
                      }`}
                    >
                      <Image
                        src={item.img}
                        alt={item.label}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <span
                      className={`text-[11px] font-black uppercase leading-none tracking-wider text-center ${
                        isSelected ? "text-[#7ac943]" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] text-orange-500 font-semibold">
                      +£{item.price.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DRINKS */}
          <div className="bg-[#050505] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,201,67,0.12),transparent_40%)] pointer-events-none" />

            <div className="flex items-center justify-center gap-4 mb-5 relative z-10">
              <div className="w-9 h-9 rounded-none bg-[#7ac943] flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(122,201,67,0.4)]">
                3
              </div>
              <h2 className="text-white uppercase tracking-widest font-extrabold text-lg">
                Choose Your Drinks
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              {DRINK_OPTIONS.map((item) => {
                const active = drinks.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleDrink(item.id)}
                    className={`group relative flex flex-col items-center justify-between h-[130px] p-3 rounded-none outline outline-1 transition-all duration-300 hover:scale-105 ${
                      active
                        ? "outline-[#7ac943] bg-[#0d0d0d] shadow-[0_0_25px_rgba(122,201,67,0.18)] scale-105"
                        : "outline-white/5 bg-white/[0.02] hover:outline-[#7ac943]/30"
                    }`}
                  >
                    <div
                      className={`relative w-16 h-16 flex items-center justify-center transition-all duration-300 ${
                        active
                          ? "drop-shadow-[0_0_18px_rgba(122,201,67,0.7)]"
                          : ""
                      }`}
                    >
                      <Image
                        src={item.img}
                        alt={item.label}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider text-center leading-tight ${
                          active ? "text-[#7ac943]" : "text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="text-[10px] text-orange-500 font-semibold">
                        +£{item.price.toFixed(2)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BILL SECTION */}
        <div
          className={`transition-all duration-700 ease-out transform origin-top overflow-hidden ${
            hasSelection
              ? "max-h-[1000px] opacity-100 scale-100 translate-y-0 mt-6"
              : "max-h-0 opacity-0 scale-95 -translate-y-2 mt-0"
          }`}
        >
          <div className="bg-neutral-950 outline outline-1 outline-[#7ac943]/30 rounded-none overflow-hidden shadow-2xl">
            <div className="border-b border-[#7ac943]/20 px-6 py-5 flex justify-between items-center">
              <h4 className="uppercase tracking-[0.25em] text-xs text-[#7ac943] font-black">
                Live Order Summary
              </h4>
              <div className="flex items-center gap-2">
                <div className="bg-black outline outline-1 outline-[#7ac943]/30 px-3 py-1 rounded-none text-[10px] uppercase tracking-widest text-[#7ac943]">
                  {totalItems} items
                </div>
                <button
                  onClick={clearSelection}
                  className="text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-none outline outline-1 outline-[#7ac943]/30 text-[#7ac943] hover:bg-[#7ac943] hover:text-black transition-all duration-300 active:scale-95"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {cartProducts.map((prod) => (
                <div
                  key={prod._id || prod.productId}
                  className="flex justify-between items-center text-sm bg-neutral-900/40 px-4 py-3 rounded-none outline outline-1 outline-neutral-800"
                >
                  <span className="text-neutral-300">
                    Product Item →{" "}
                    <strong className="text-[#7ac943]">{prod.name}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white">
                      £{(prod.sellingPrice || prod.price || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleToggleProductCart(prod)}
                      className="text-red-400 hover:text-red-300 text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {selectedExtras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex justify-between items-center text-sm px-4 py-3 bg-neutral-900/20 rounded-none outline outline-1 outline-neutral-800"
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

              {selectedDrinks.map((drink) => (
                <div
                  key={drink.id}
                  className="flex justify-between items-center text-sm bg-neutral-900/40 px-4 py-3 rounded-none outline outline-1 outline-neutral-800"
                >
                  <span className="text-neutral-300">
                    Drink →{" "}
                    <strong className="text-[#7ac943]">{drink.label}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white">
                      £{drink.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => toggleDrink(drink.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-black"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#7ac943]/20 bg-black/60 px-6 py-5 flex flex-col md:flex-row gap-5 items-center justify-between">
              <div>
                <p className="uppercase tracking-[0.25em] text-[10px] text-[#7ac943] font-black">
                  Total Cost
                </p>
                <h2 className="text-4xl font-black mt-2 text-white">
                  £{total.toFixed(2)}
                </h2>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!hasSelection}
                className={`w-full md:w-auto font-black px-10 py-4 rounded-none transition-all duration-300 ${
                  hasSelection
                    ? "bg-[#7ac943] text-black hover:bg-[#68b038]"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY PRODUCTS POPUP MODAL */}
        {activeModalBase && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveModalBase(null)}
          >
            <div
              className="bg-zinc-950 outline outline-1 outline-zinc-800 w-full max-w-lg rounded-none p-6 relative shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalBase(null)}
                className="absolute top-4 right-4 bg-zinc-900 outline outline-1 outline-zinc-800 p-2 rounded-none hover:bg-[#7ac943] hover:text-black text-white transition-all z-50"
              >
                <X size={18} />
              </button>

              <div className="mb-4 pb-3 border-b border-zinc-900">
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  Select {activeModalBase} Items
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Choose multiple items for your meal configuration.
                </p>
              </div>

              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {loadingProducts ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2
                      className="animate-spin text-[#7ac943]"
                      size={32}
                    />
                  </div>
                ) : categoryProducts[activeModalBase] &&
                  categoryProducts[activeModalBase].length > 0 ? (
                  categoryProducts[activeModalBase].map((prod) => {
                    const prodId = prod._id || prod.productId || "";
                    const added = isProductInCart(prodId);

                    const imageUrl =
                      (Array.isArray(prod.media) &&
                        prod.media[0]?.secure_url) ||
                      prod.media?.secure_url ||
                      prod.media ||
                      prod.image ||
                      "/assets/Custom/bacon.png";

                    return (
                      <div
                        key={prodId}
                        className="flex items-center justify-between gap-4 bg-zinc-900/60 p-3.5 rounded-none outline outline-1 outline-zinc-800"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-14 h-14 rounded-none overflow-hidden shrink-0 bg-zinc-950 outline outline-1 outline-zinc-800">
                            <Image
                              src={imageUrl}
                              alt={prod.name || "Product image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white font-bold text-sm truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-[#7ac943] font-black text-sm">
                                £{prod.sellingPrice || prod.price}
                              </p>
                              {prod.calories && (
                                <div className="flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded-none text-[10px] text-amber-400 font-medium">
                                  <Flame
                                    size={12}
                                    className="text-orange-400"
                                  />
                                  <span>{prod.calories} kcal</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleProductCart(prod)}
                          className={`px-4 py-2 rounded-none font-bold text-xs flex items-center gap-1 transition-all shrink-0 ${
                            added
                              ? "bg-red-500/10 text-red-400 outline outline-1 outline-red-500/30 hover:bg-red-500 hover:text-white"
                              : "bg-[#7ac943] hover:bg-[#68b038] text-black shadow-md"
                          }`}
                        >
                          {added ? (
                            <>
                              <Check size={14} /> <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus size={14} /> <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-zinc-500 text-xs uppercase tracking-widest">
                    No items available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
