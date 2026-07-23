"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Plus, Loader2, Flame, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart, removeFromCart } from "@/store/reducer/cartReducer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 🟢 Helper to ensure valid Image URL
const getValidImageUrl = (mediaArray) => {
  if (!mediaArray) return "/placeholder.png";

  let first = mediaArray;

  if (Array.isArray(mediaArray)) {
    if (mediaArray.length === 0) return "/placeholder.png";
    first = mediaArray[0];
  }

  if (typeof first === "string") {
    if (
      first.startsWith("http://") ||
      first.startsWith("https://") ||
      first.startsWith("/")
    ) {
      return first;
    }
  } else if (typeof first === "object" && first !== null) {
    return first.secure_url || first.url || "/placeholder.png";
  }

  return "/placeholder.png";
};

// 🟢 Strip HTML tags for clean card description preview
const stripHtml = (htmlString) => {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>?/gm, "").trim();
};

export default function CategoryGrid() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();

  const cartProducts = useSelector((store) => store.cartStore?.products) || [];
  const totalCount = useSelector((store) => store.cartStore?.count) || 0;

  // 1. 🟢 DB থেকে ক্যাটাগরি লিস্ট ফেচ করা
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories-list"],
    queryFn: async () => {
      const res = await axios.get("/api/category");
      return res.data?.data || [];
    },
  });

  // 2. 🟢 সিলেক্ট করা ক্যাটাগরির প্রোডাক্ট লিস্ট DB থেকে নিয়ে আসা
  const { data: categoryProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ["category-products", selectedCategory?._id],
    queryFn: async () => {
      if (!selectedCategory?._id) return [];
      const res = await axios.get(
        `/api/product?category=${selectedCategory._id}`,
      );
      return res.data?.data || [];
    },
    enabled: !!selectedCategory?._id,
  });

  const categories = categoriesData || [];

  const isProductInCart = (prod) => {
    return cartProducts.some((item) => item.productId === prod._id);
  };

  const handleToggleCart = (prod) => {
    const isAdded = isProductInCart(prod);
    const prodImg = getValidImageUrl(prod.media);

    if (isAdded) {
      dispatch(removeFromCart({ productId: prod._id }));
    } else {
      dispatch(
        addIntoCart({
          productId: prod._id,
          variantId: "default",
          title: prod.name,
          price: prod.sellingPrice || prod.mrp,
          image: prodImg,
          quantity: 1,
        }),
      );
    }
  };

  return (
    <section className="bg-black px-3 md:px-6 py-8">
      {/* Header (Exact same layout) */}
      <div className="max-w-8xl mx-auto flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-sm md:text-2xl font-extrabold uppercase tracking-wide">
            OUR <span className="text-orange-500">MENU</span>
          </h2>
          <div className="h-[2px] w-16 bg-orange-500"></div>
        </div>

        {/* Cart Counter */}
        <button className="relative p-2.5 bg-[#111] rounded-full border border-zinc-800 text-orange-500 hover:bg-zinc-800 transition-all">
          <ShoppingBag size={20} />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {totalCount}
            </span>
          )}
        </button>
      </div>

      {/* Menu Grid Loading Skeleton */}
      {isCategoriesLoading ? (
        <div className="max-w-8xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-[305px] bg-[#0d0d0d] border border-zinc-800 rounded-md animate-pulse"
            />
          ))}
        </div>
      ) : (
        /* Dynamic Menu Grid */
        <div className="max-w-8xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((item) => {
            const catImage = getValidImageUrl(item.media || item.image);
            const cleanDescription = stripHtml(item.description);

            return (
              <button
                key={item._id}
                onClick={() => setSelectedCategory(item)}
                className="group text-left bg-[#0d0d0d] border border-zinc-800 rounded-md overflow-hidden hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative w-full h-[160px] md:h-[180px] overflow-hidden bg-black shrink-0">
                  <Image
                    src={catImage}
                    alt={item.name || "Menu Category"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content (Title & Description only) */}
                <div className="p-3 flex flex-col min-h-[120px] flex-1">
                  <h3 className="text-white text-sm md:text-[15px] font-bold leading-tight mb-2 group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed line-clamp-3">
                    {cleanDescription ||
                      "Delicious items available in this category."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Category Popup Modal */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="bg-[#111] border border-zinc-800 w-full max-w-lg rounded-2xl p-5 sm:p-6 relative shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-3 right-3 bg-zinc-800 p-2 rounded-full hover:bg-orange-500 hover:text-black text-white transition-all z-50"
            >
              <X size={18} />
            </button>

            {/* Modal Category Header */}
            <div className="mb-4 pb-3 border-b border-zinc-800 shrink-0">
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black mb-3 border border-zinc-900">
                <Image
                  src={getValidImageUrl(selectedCategory.media)}
                  alt={selectedCategory.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                {selectedCategory.name}
              </h2>
              {selectedCategory.description && (
                <div
                  className="text-zinc-400 text-xs mt-1 leading-relaxed line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: selectedCategory.description,
                  }}
                />
              )}
            </div>

            {/* Modal Products List (Shows Price, Calories & Add Button) */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {isProductsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-400">
                  <Loader2 size={28} className="animate-spin text-orange-500" />
                  <p className="text-xs">Loading items...</p>
                </div>
              ) : categoryProducts && categoryProducts.length > 0 ? (
                categoryProducts.map((prod) => {
                  const added = isProductInCart(prod);
                  const prodImg = getValidImageUrl(prod.media);
                  const calories = prod.calories || prod.kCal || 450;

                  return (
                    <div
                      key={prod._id}
                      className="flex items-center gap-3 bg-[#181818] p-3 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-all"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-black">
                        <Image
                          src={prodImg}
                          alt={prod.name}
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm line-clamp-1">
                          {prod.name}
                        </h4>

                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-orange-500 font-extrabold text-sm">
                            ৳{prod.sellingPrice || prod.mrp}
                          </p>

                          <div className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-full text-[10px] text-amber-400 font-medium">
                            <Flame
                              size={12}
                              className="text-orange-400 shrink-0"
                            />
                            <span>{calories} kcal</span>
                          </div>
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => handleToggleCart(prod)}
                        className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition-all shrink-0 ${
                          added
                            ? "bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600 hover:text-white"
                            : "bg-orange-500 hover:bg-orange-400 text-black shadow-md shadow-orange-500/20"
                        }`}
                      >
                        {added ? (
                          <>
                            <Check size={14} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-zinc-500 py-8 text-xs">
                  No items found in this category.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
