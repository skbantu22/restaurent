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

      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const navItem =
    "relative text-sm font-bold uppercase tracking-wide hover:text-[#ff6b00] transition duration-300";

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* MAIN NAVBAR */}
        <div className="h-[85px] flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <button
              className="lg:hidden text-white"
              onClick={() => setOpenMenu(true)}
            >
              <Menu size={28} />
            </button>

            {/* Logo */}
            <Link href={WEBSITE_HOME} className="flex items-center">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={100}
                priority
                className="
      object-contain
      w-[90px] h-auto
      sm:w-[110px]
      lg:w-[140px]
    "
              />
            </Link>
          </div>

          {/* CENTER MENU */}
          <nav className="hidden lg:flex items-center gap-12 text-white">
            <Link href="#" className={`${navItem} text-[#ff6b00]`}>
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

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <div className="hidden lg:flex items-center justify-center text-white hover:text-[#ff6b00] transition">
              <Cart />
            </div>

            {/* User */}
            {!auth ? (
              <Link
                href={WEBSITE_LOGIN}
                className="w-11 h-11 rounded-full border border-[#2a2a2a] hidden lg:flex items-center justify-center text-white hover:border-[#ff6b00] hover:text-[#ff6b00] transition"
              >
                <User size={20} />
              </Link>
            ) : (
              <Link href={USER_DASHBOARD} className="hidden lg:flex">
                <Avatar className="h-11 w-11 border border-[#2a2a2a]">
                  <AvatarImage
                    src={auth?.avatar?.url || userIcon.src}
                    alt={auth?.name || "User Avatar"}
                  />
                </Avatar>
              </Link>
            )}

            {/* Order Button */}
            <button
              className="
    bg-[#ff6b00]
    hover:bg-[#ff7e29]
    transition-all duration-300
    text-white font-bold uppercase
    px-4 sm:px-5 lg:px-7
    h-10 sm:h-11 lg:h-12
    text-[11px] sm:text-sm lg:text-base
    rounded-md
    flex items-center justify-center gap-1.5 sm:gap-2
    tracking-wide
    shadow-lg shadow-orange-500/20
    w-full sm:w-auto
  "
            >
              ORDER NOW
              <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenMenu(false)}
          />

          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-[300px] bg-black border-r border-[#1f1f1f] p-5 flex flex-col text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
              <span className="text-lg font-bold uppercase">Menu</span>

              <button onClick={() => setOpenMenu(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-5 py-6 border-b border-[#1f1f1f] text-sm font-semibold uppercase">
              <Link href="#">Home</Link>
              <Link href="#">Menu</Link>
              <Link href="#">Build Your Own</Link>
              <Link href="#">Our Story</Link>
              <Link href="#">Contact</Link>
            </nav>

            {/* User Section */}
            <div className="flex flex-col gap-5 py-6 text-sm">
              {!auth ? (
                <>
                  <Link
                    href={WEBSITE_LOGIN}
                    className="flex items-center gap-3"
                  >
                    <User size={18} />
                    Sign In
                  </Link>

                  <Link
                    href={WEBSITE_REGISTER}
                    className="flex items-center gap-3"
                  >
                    <User size={18} />
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={USER_DASHBOARD}
                    className="flex items-center gap-3"
                  >
                    <User size={18} />
                    My Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-left"
                  >
                    <LogOutIcon size={18} />
                    Logout
                  </button>
                </>
              )}

              <Link href="/wishlist" className="flex items-center gap-3">
                <Heart size={18} />
                Wishlist
              </Link>

              <Link href="/track-order" className="flex items-center gap-3">
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
