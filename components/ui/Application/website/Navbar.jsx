"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Heart,
  X,
  User,
  LogOutIcon,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import logo from "@/public/assets/logo.png";
import userIcon from "@/public/assets/user.png";

import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
} from "@/Route/Websiteroute";

import Cart from "./cart";
import { Avatar, AvatarImage } from "../../avatar";
import { showToast } from "@/lib/showToast";
import { logout } from "@/store/reducer/authReducer";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const auth = useSelector((store) => store.authStore.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");

      if (!data.success) throw new Error(data.message);

      dispatch(logout());
      showToast("success", data.message);
      setOpenMenu(false);

      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const navItem =
    "relative text-sm font-bold uppercase tracking-wide hover:text-[#ff6b00] transition duration-300";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-black">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        {/* MAIN NAVBAR */}
        <div className="flex h-[80px] sm:h-[85px] items-center justify-between gap-2 sm:gap-4">
          {/* LEFT: Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="text-white lg:hidden p-1 focus:outline-none"
              onClick={() => setOpenMenu(true)}
              aria-label="Toggle Menu"
            >
              <Menu size={26} />
            </button>

            <Link href={WEBSITE_HOME} className="flex items-center">
              <Image
                src={logo}
                alt="Logo"
                width={140}
                height={100}
                priority
                className="h-auto w-[85px] sm:w-[110px] lg:w-[130px] object-contain"
              />
            </Link>
          </div>

          {/* CENTER MENU (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 text-white">
            <Link href={WEBSITE_HOME} className={`${navItem} text-[#ff6b00]`}>
              HOME
              <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-[#ff6b00]" />
            </Link>

            <Link href="#" className={navItem}>
              MENU
            </Link>

            <Link href="#" className={navItem}>
              BUILD YOUR OWN
            </Link>

            <Link href="#" className={navItem}>
              OUR STORY
            </Link>

            <Link href="#" className={navItem}>
              CONTACT
            </Link>
          </nav>

          {/* RIGHT SIDE: Cart, User & Order Action */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Cart Drawer Icon */}
            <div className="flex items-center justify-center text-white transition hover:text-[#ff6b00]">
              <Cart />
            </div>

            {/* Desktop User Avatar/Login */}
            {!auth ? (
              <Link
                href={WEBSITE_LOGIN}
                className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] text-white transition hover:border-[#ff6b00] hover:text-[#ff6b00]"
              >
                <User size={18} />
              </Link>
            ) : (
              <Link href={USER_DASHBOARD} className="hidden lg:flex">
                <Avatar className="h-10 w-10 border border-[#2a2a2a]">
                  <AvatarImage
                    src={auth?.avatar?.url || userIcon.src}
                    alt={auth?.name || "User Avatar"}
                  />
                </Avatar>
              </Link>
            )}

            {/* Order Now Button */}
            <button
              className="
                flex h-9 sm:h-11 items-center justify-center gap-1.5 rounded-md bg-[#ff6b00] 
                px-3 sm:px-5 lg:px-6 text-[11px] sm:text-xs lg:text-sm font-bold uppercase 
                tracking-wider text-white shadow-lg shadow-orange-500/20 
                transition-all duration-300 hover:bg-[#ff7e29] active:scale-95
              "
            >
              <span className="hidden sm:inline">ORDER NOW</span>
              <span className="sm:hidden">ORDER</span>
              <ShoppingBag size={15} className="sm:w-[17px] sm:h-[17px]" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU */}
      {openMenu && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setOpenMenu(false)}
          />

          {/* Drawer Sidebar */}
          <div className="absolute left-0 top-0 flex h-full w-[280px] sm:w-[320px] flex-col border-r border-[#1f1f1f] bg-black p-5 text-white shadow-2xl transition-transform">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
              <span className="text-base font-bold uppercase tracking-wider text-[#ff6b00]">
                Navigation
              </span>
              <button
                onClick={() => setOpenMenu(false)}
                className="rounded-full p-1 hover:bg-[#1f1f1f]"
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-4 border-b border-[#1f1f1f] py-6 text-sm font-semibold uppercase tracking-wide">
              <Link href={WEBSITE_HOME} onClick={() => setOpenMenu(false)}>
                Home
              </Link>
              <Link href="#" onClick={() => setOpenMenu(false)}>
                Menu
              </Link>
              <Link href="#" onClick={() => setOpenMenu(false)}>
                Build Your Own
              </Link>
              <Link href="#" onClick={() => setOpenMenu(false)}>
                Our Story
              </Link>
              <Link href="#" onClick={() => setOpenMenu(false)}>
                Contact
              </Link>
            </nav>

            {/* Mobile User & Utility Section */}
            <div className="flex flex-col gap-4.5 py-6 text-sm">
              {!auth ? (
                <>
                  <Link
                    href={WEBSITE_LOGIN}
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-3 hover:text-[#ff6b00]"
                  >
                    <User size={18} />
                    Sign In
                  </Link>

                  <Link
                    href={WEBSITE_REGISTER}
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-3 hover:text-[#ff6b00]"
                  >
                    <User size={18} />
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={USER_DASHBOARD}
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-3 hover:text-[#ff6b00]"
                  >
                    <User size={18} />
                    My Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-left text-red-500 hover:text-red-400"
                  >
                    <LogOutIcon size={18} />
                    Logout
                  </button>
                </>
              )}

              <Link
                href="/wishlist"
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 hover:text-[#ff6b00]"
              >
                <Heart size={18} />
                Wishlist
              </Link>

              <Link
                href="/track-order"
                onClick={() => setOpenMenu(false)}
                className="flex items-center gap-3 hover:text-[#ff6b00]"
              >
                <Package size={18} />
                Track Order
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
