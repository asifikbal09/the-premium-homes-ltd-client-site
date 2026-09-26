"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavDropdownMenu } from "@/components/navbar";

export function CareerHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroNavRef = useRef<HTMLDivElement>(null);

  // Close hero dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Close hero dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        heroNavRef.current &&
        !heroNavRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const scrollToPositions = () => {
    const el = document.getElementById("open-positions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Career Hero Section"
      className="relative w-full bg-[#061d16] bg-[radial-gradient(ellipse_100%_80%_at_50%_25%,#092e24_0%,#061d16_65%,#03130f_100%)] text-white overflow-hidden"
    >
      {/* Background Ambience Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(208, 166, 91, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-20 sm:pb-28 md:pb-36 lg:pb-40 flex flex-col justify-between min-h-[520px] sm:min-h-[580px] md:min-h-[640px]">
        {/* Top Header Bar inside Hero */}
        <div ref={heroNavRef} className="relative z-30 w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Premium Homes Home"
            >
              <div className="relative h-7 sm:h-8 md:h-9 w-32 sm:w-40 md:w-48">
                <Image
                  src="/image/logo/LOGO-WHITE.png"
                  alt="Premium Homes"
                  fill
                  priority
                  sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, 200px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Top Right Action Pills */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-sm active:scale-95"
              >
                <span>ALL PROJECT</span>
              </Link>

              {/* MENU Toggle Button */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={
                  menuOpen ? "Close Navigation Menu" : "Open Navigation Menu"
                }
                aria-expanded={menuOpen}
                className={cn(
                  "group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white border transition-all duration-300 shadow-sm cursor-pointer active:scale-95",
                  menuOpen
                    ? "bg-white/25 border-white/40"
                    : "bg-white/10 hover:bg-white/20 border-white/20",
                )}
              >
                <span
                  className="flex flex-col justify-center gap-[4.5px] w-3.5"
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                      menuOpen && "rotate-45 translate-y-[3px]",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                      menuOpen && "-rotate-45 -translate-y-[3px]",
                    )}
                  />
                </span>
                <span>MENU</span>
              </button>
            </div>
          </div>

          {/* Dropdown Menu attached directly beneath top bar */}
          <NavDropdownMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            className="mt-3 rounded-xl sm:rounded-2xl border border-white/15 shadow-2xl"
          />
        </div>

        {/* Center Typography matching Image 1 */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 sm:mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-2"
          >
            {/* Breadcrumb / Eyebrow Label */}
            <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-4 sm:mb-6">
              HOMEPAGE / CARRER
            </span>

            {/* Display Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-normal text-white leading-[1.08] sm:leading-[1.04] tracking-tight">
              Build Your Future
              <br />
              With Premium Homes
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-white/75 font-light leading-relaxed max-w-xl mx-auto mt-5 sm:mt-7">
              Join a fast-growing real estate group shaping tomorrow&apos;s
              communities across the region.
              <br className="hidden sm:inline" /> We&apos;re looking for
              passionate people ready to innovate, grow, and make an impact.
            </p>

            {/* View Open Positions CTA Button */}
            <div className="mt-8 sm:mt-10">
              <button
                type="button"
                onClick={scrollToPositions}
                className="group relative inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-white bg-[#2b3e34] hover:bg-[#344b3f] border border-[#43594d] transition-all duration-300 shadow-md cursor-pointer active:scale-95"
              >
                <span>VIEW OPEN POSITIONS</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
