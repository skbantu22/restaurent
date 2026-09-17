"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOutIcon,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import logo from "@/public/assets/logo-transparent.png";

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

const NAV_LINKS = [
  { label: "HOME", href: WEBSITE_HOME },
  { label: "MENU", href: "/#our-menu" },
  { label: "OUR STORY", href: "/#our-story" },
  { label: "CONTACT", href: "/#contact" },
];

const MOBILE_LINK_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const MOBILE_LINK_ITEM = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

function NavItem({ href, label }) {
  const pathname = usePathname();
  const isActive = href !== "#" && pathname === href;

  return (
    <Link
      href={href}
      className={`relative py-1 text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
        isActive ? "text-[#ff6b00]" : "text-white hover:text-[#ff6b00]"
      }`}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute left-0 -bottom-2 h-[2px] w-full bg-[#ff6b00]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="absolute left-0 -bottom-2 h-[2px] w-full origin-center scale-x-0 bg-[#ff6b00]/60 transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const auth = useSelector((store) => store.authStore.auth);
  // auth is the login response ({ data: { user } }) or, after a profile
  // update, the user itself — read the photo from either shape
  const avatarUrl =
    auth?.avatar?.url ||
    auth?.data?.user?.avatar?.url ||
    auth?.user?.avatar?.url ||
    "";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        {/* MAIN NAVBAR */}
        <div className="flex h-[80px] sm:h-[85px] lg:h-[64px] items-center justify-between gap-2 sm:gap-4">
          {/* LEFT: Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="text-white lg:hidden -ml-2 flex h-11 w-11 items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00]/50"
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
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
            {NAV_LINKS.map((item) => (
              <div key={item.label} className="group">
                <NavItem href={item.href} label={item.label} />
              </div>
            ))}
          </nav>

          {/* RIGHT SIDE: Cart, User & Order Action */}
          <div className="flex items-center gap-0.5">
            {/* Cart Drawer Icon */}
            <Cart />

            {/* Desktop User Avatar/Login */}
            {!auth ? (
              <Link
                href={WEBSITE_LOGIN}
                className="hidden lg:flex h-9 w-8 items-center justify-center rounded-md text-white transition-colors duration-200 hover:text-[#ff6b00]"
              >
                <User size={22} strokeWidth={2.5} />
              </Link>
            ) : avatarUrl ? (
              <Link href={USER_DASHBOARD} className="hidden lg:flex h-9 w-9 items-center justify-center">
                <Avatar className="h-7 w-7 border border-[#2a2a2a] transition-colors duration-200 hover:border-[#ff6b00]">
                  <AvatarImage
                    src={avatarUrl}
                    alt={auth?.name || "User Avatar"}
                  />
                </Avatar>
              </Link>
            ) : (
              // Logged in without a photo: same small outlined icon as the
              // login button, instead of the large grey placeholder image
              <Link
                href={USER_DASHBOARD}
                aria-label={auth?.name || "My account"}
                className="hidden lg:flex h-9 w-8 items-center justify-center rounded-md text-white transition-colors duration-200 hover:text-[#ff6b00]"
              >
                <User size={22} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU */}
      <AnimatePresence>
        {openMenu && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpenMenu(false)}
            />

            {/* Drawer Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute left-0 top-0 flex h-full w-[280px] sm:w-[320px] flex-col border-r border-[#1f1f1f] bg-black p-5 text-white shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
                <span className="text-base font-bold uppercase tracking-wider text-[#ff6b00]">
                  Navigation
                </span>
                <button
                  onClick={() => setOpenMenu(false)}
                  className="rounded-full p-1 transition-colors duration-200 hover:bg-[#1f1f1f]"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <motion.nav
                variants={MOBILE_LINK_VARIANTS}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4 border-b border-[#1f1f1f] py-6 text-sm font-semibold uppercase tracking-wide"
              >
                {NAV_LINKS.map((item) => (
                  <motion.div key={item.label} variants={MOBILE_LINK_ITEM}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenMenu(false)}
                      className="transition-colors duration-200 hover:text-[#ff6b00]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Mobile User & Utility Section */}
              <motion.div
                variants={MOBILE_LINK_VARIANTS}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4.5 py-6 text-sm"
              >
                {!auth ? (
                  <>
                    <motion.div variants={MOBILE_LINK_ITEM}>
                      <Link
                        href={WEBSITE_LOGIN}
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-3 transition-colors duration-200 hover:text-[#ff6b00]"
                      >
                        <User size={18} />
                        Sign In
                      </Link>
                    </motion.div>

                    <motion.div variants={MOBILE_LINK_ITEM}>
                      <Link
                        href={WEBSITE_REGISTER}
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-3 transition-colors duration-200 hover:text-[#ff6b00]"
                      >
                        <User size={18} />
                        Create Account
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={MOBILE_LINK_ITEM}>
                      <Link
                        href={USER_DASHBOARD}
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-3 transition-colors duration-200 hover:text-[#ff6b00]"
                      >
                        <User size={18} />
                        My Account
                      </Link>
                    </motion.div>

                    <motion.button
                      variants={MOBILE_LINK_ITEM}
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-left text-red-500 transition-colors duration-200 hover:text-red-400"
                    >
                      <LogOutIcon size={18} />
                      Logout
                    </motion.button>
                  </>
                )}

              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
