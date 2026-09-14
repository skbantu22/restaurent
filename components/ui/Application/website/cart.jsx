"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BsCart2 } from "react-icons/bs";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  removeFromCart,
  removeBundle,
  increaseQuantity,
  decreaseQuantity,
} from "@/store/reducer/cartReducer";
import { Button } from "@/components/ui/button";
import imgPlaceholder from "@/public/assets/img-placeholder.webp";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { trackMetaEvent } from "@/lib/meta/metaTrack";

const getPrice = (price) => {
  if (!price) return 0;
  return parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
};

// `nested`: true when rendered inside a bundle package card (see
// below) — drops its own border/background so it reads as one row
// within the package rather than a box inside a box.
function CartItemRow({ item, dispatch, nested = false }) {
  const itemPrice = getPrice(item.price);
  // The custom-meal builder's base-protein line (e.g. "Category:
  // Beef") is informational only — £0, always qty 1, and never shows
  // quantity controls, here or on the checkout page (see
  // app/(root)/(website)/checkout/page.jsx).
  const isCategoryItem = String(item.productId || "").startsWith("category-");
  // Items inside a bundle package aren't deleted individually — the
  // whole package has one delete button on its header instead (see
  // the bundle card below).
  const showDelete = !nested;

  return (
    <div
      className={
        nested
          ? "flex gap-3 py-2 border-b border-[#262626] last:border-b-0"
          : "flex gap-4 p-3 rounded-xl bg-[#1a1a1a] border border-[#262626] hover:border-[#333] transition-all"
      }
    >
      {/* Thumbnail */}
      <div
        className={`relative flex-shrink-0 overflow-hidden bg-[#222] border border-[#2a2a2a] ${
          nested ? "h-12 w-12 rounded-md" : "h-20 w-20 rounded-lg"
        }`}
      >
        <Image
          src={
            item.img ||
            item.image ||
            item.media?.[0]?.secure_url ||
            item.media?.[0]?.url ||
            imgPlaceholder
          }
          alt={item.title || "Product Image"}
          fill
          sizes={nested ? "48px" : "80px"}
          className="object-cover"
        />
      </div>

      {/* Info & Action */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className={`font-semibold text-gray-100 line-clamp-1 ${nested ? "text-xs" : "text-sm"}`}>
              {item.name || item.title}
            </h3>
            {showDelete && (
              <button
                onClick={() => dispatch(removeFromCart({ productId: item.productId }))}
                className="text-gray-500 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={nested ? 13 : 15} />
              </button>
            )}
          </div>

          {itemPrice > 0 && (
            <p className={`text-[#ff6b00] font-bold mt-0.5 ${nested ? "text-xs" : "text-sm"}`}>
              £{itemPrice.toLocaleString()}
            </p>
          )}
        </div>

        {/* Quantity Control */}
        {isCategoryItem ? (
          <p className="mt-2 text-xs text-gray-500 italic">Base selection — included</p>
        ) : (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center bg-[#242424] rounded-lg border border-[#333]">
              <button
                className="p-1.5 text-gray-300 hover:text-[#ff6b00] transition-colors"
                onClick={() => dispatch(decreaseQuantity({ productId: item.productId }))}
              >
                <Minus size={13} />
              </button>
              <span className="px-3 text-xs font-semibold text-white">{item.quantity}</span>
              <button
                className="p-1.5 text-gray-300 hover:text-[#ff6b00] transition-colors"
                onClick={() => dispatch(increaseQuantity({ productId: item.productId }))}
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Nested rows (inside a bundle package) skip their own
                "Total" — the bundle header already shows one combined
                total for the whole package, so repeating a per-item
                total underneath just doubled up confusingly. */}
            {!nested && (
              <span className="text-xs text-gray-400 font-medium">
                Total: £{(itemPrice * item.quantity).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const Cart = ({ active }) => {
  const dispatch = useDispatch();
  const { products, count } = useSelector((store) => store.cartStore);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    console.log("Cart Products:", products);
  }, [products]);

  // Route change হলে Cart Auto Close হবে
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    console.log(JSON.stringify(products, null, 2));
  }, [products]);

  const subtotal = useMemo(() => {
    return products.reduce(
      (acc, item) => acc + getPrice(item.price) * Number(item.quantity || 0),
      0,
    );
  }, [products]);

  // Items added together from the custom-meal builder share a
  // bundleId (see customorders.jsx) — group them into one "package"
  // card instead of scattered separate rows. Regular products (no
  // bundleId) render individually as before.
  const { bundles, singles } = useMemo(() => {
    const bundleMap = new Map();
    const singleItems = [];

    products.forEach((item) => {
      if (item.bundleId) {
        if (!bundleMap.has(item.bundleId)) {
          bundleMap.set(item.bundleId, {
            bundleId: item.bundleId,
            label: item.bundleLabel || "Custom Meal",
            items: [],
          });
        }
        bundleMap.get(item.bundleId).items.push(item);
      } else {
        singleItems.push(item);
      }
    });

    return { bundles: Array.from(bundleMap.values()), singles: singleItems };
  }, [products]);

  const handleCheckoutClick = () => {
    if (products.length > 0) {
      trackMetaEvent("InitiateCheckout", {
        content_type: "product",
        num_items: count,
        value: subtotal,
        currency: "GBP",
      });
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="relative flex items-center justify-center p-2 text-white hover:text-[#ff6b00] transition-colors focus:outline-none"
          aria-label="Open Cart Drawer"
        >
          <BsCart2 size={active ? 24 : 22} />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6b00] text-[10px] font-bold text-white shadow-lg animate-in zoom-in-50">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-72 !sm:w-60 md:w-[400px] lg:w-[400px] p-0 bg-[#121212] border-l border-[#222222] text-white flex flex-col shadow-2xl z-[150]"
      >
        {/* HEADER */}
        <SheetHeader className="px-6 py-4 border-b border-[#222222] flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#ff6b00]" />
            Your Order
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20">
              {count} items
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* CART ITEM LIST */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {products.length === 0 ? (
            <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-gray-500 gap-3">
              <ShoppingBag size={56} className="opacity-20 text-[#ff6b00]" />
              <p className="text-sm font-medium">
                Your order feels a bit light!
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 text-xs text-[#ff6b00] uppercase font-bold hover:underline"
              >
                Browse the Menu
              </button>
            </div>
          ) : (
            <>
              {bundles.map((bundle) => {
                const bundleTotal = bundle.items.reduce(
                  (sum, item) => sum + getPrice(item.price) * Number(item.quantity || 0),
                  0,
                );

                return (
                  <div
                    key={bundle.bundleId}
                    className="rounded-xl border border-[#ff6b00]/30 bg-[#1a1a1a] overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-3 py-2 bg-[#ff6b00]/10 border-b border-[#ff6b00]/20">
                      <span className="text-xs font-bold uppercase tracking-wide text-[#ff6b00]">
                        {bundle.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-300">
                          £{bundleTotal.toLocaleString()}
                        </span>
                        <button
                          onClick={() => dispatch(removeBundle({ bundleId: bundle.bundleId }))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove this meal"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="px-3 py-1">
                      {bundle.items
                        .filter((item) => !String(item.productId || "").startsWith("category-"))
                        .map((item) => (
                        <CartItemRow
                          key={item.productId}
                          item={item}
                          dispatch={dispatch}
                          nested
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {singles.map((item) => (
                <CartItemRow key={item.productId} item={item} dispatch={dispatch} />
              ))}
            </>
          )}
        </div>

        {/* FOOTER & CHECKOUT */}
        {products.length > 0 && (
          <div className="border-t border-[#222222] p-6 bg-[#161616] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-medium">
                Subtotal
              </span>
              <span className="text-xl font-extrabold text-white">
                £{subtotal.toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={handleCheckoutClick}
              className="block"
            >
              <Button className="w-full h-12 bg-[#ff6b00] hover:bg-[#ff7e29] text-white text-base font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                Proceed to Checkout
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
