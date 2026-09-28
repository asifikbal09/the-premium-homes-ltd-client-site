"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavDropdownMenu } from "@/components/navbar";

export function ProjectProgressHero() {
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
      const target = event.target as Element;
      if (target?.closest?.("[data-navigation-drawer]")) {
        return;
      }
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

  return (
    <section
      aria-label="Project Progress Hero Section"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-20 sm:pb-28 md:pb-36 flex flex-col justify-between min-h-[540px] sm:min-h-[580px] md:min-h-[640px]">
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

        {/* Hero Content Section */}
        <div className="flex-1 flex flex-col justify-center mt-12 sm:mt-16 md:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Heading and Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Breadcrumb / Category Tag */}
              <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-4 sm:mb-6">
                HOMEPAGE / PROJECT PROGRESS
              </span>

              {/* Display Headline */}
              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[74px] xl:text-[80px] font-normal text-white leading-[1.08] sm:leading-[1.04] tracking-tight">
                Building Your Future
                <br />
                Step By Step
              </h1>

              {/* Subtitle */}
              <p className="font-sans text-xs sm:text-sm md:text-base text-white/75 font-light leading-relaxed max-w-xl mt-5 sm:mt-7">
                Track the progress of our communities as they take shape - from
                foundation to handover.
              </p>
            </motion.div>

            {/* Right Column: Featured Project Progress Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-[340px] sm:max-w-[360px] rounded-2xl bg-[#0c2620]/80 backdrop-blur-md border border-white/10 p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:border-white/20">
                {/* Project Image */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/40">
                  <Image
                    src="/image/progress/tph_green_valley.png"
                    alt="TPH Green Valley"
                    fill
                    sizes="(max-width: 640px) 300px, 360px"
                    className="object-cover object-center"
                    priority
                  />
                </div>

                {/* Project Details */}
                <div className="mt-4">
                  <h2 className="font-heading text-lg sm:text-xl font-medium text-white tracking-wide">
                    TPH Green Valley
                  </h2>

                  <div className="flex items-center gap-1.5 text-xs text-white/60 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-[#d0a65b] shrink-0" />
                    <span>Bashundhara R/A, Dhaka</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10 my-3.5 sm:my-4" />

                  {/* Progress Info */}
                  <div>
                    <span className="font-heading text-xs sm:text-[13px] text-white/80 tracking-wide block">
                      Construction Progress
                    </span>

                    <span className="font-heading text-3xl sm:text-4xl text-[#d0a65b] font-normal leading-tight block mt-1">
                      68%
                    </span>

                    {/* Progress Bar */}
                    <div
                      role="progressbar"
                      aria-valuenow={68}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="TPH Green Valley construction progress 68%"
                      className="w-full h-2 sm:h-2.5 bg-white/20 rounded-full overflow-hidden mt-3 relative"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "68%" }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-[#d0a65b] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
