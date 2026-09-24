"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavDropdownMenu } from "@/components/navbar";

export function ProjectsHero() {
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

  return (
    <section
      aria-label="Projects Hero Section"
      className="relative w-full bg-[#031310] overflow-hidden"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/image/projects/projectsHero.png"
          alt="Exclusive Properties In Prime Locations"
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-center transform scale-100"
        />

        {/* Soft Linear Gradient Overlay for text contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(3, 19, 16, 0.45) 0%, rgba(3, 19, 16, 0.1) 40%, rgba(3, 19, 16, 0.4) 100%)",
          }}
        />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-24 md:pb-32 lg:pb-36 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[660px]">
        {/* Top Header Bar inside Hero */}
        <div ref={heroNavRef} className="relative z-30 w-full">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Premium Homes Home"
            >
              <div className="relative h-6 sm:h-8 md:h-9 w-28 sm:w-40 md:w-48">
                <Image
                  src="/image/logo.png"
                  alt="Premium Homes"
                  fill
                  priority
                  sizes="(max-width: 640px) 130px, (max-width: 768px) 180px, 200px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Top Right Action Pills */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* ALL PROJECT Button */}
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-black/35 hover:bg-black/55 border border-white/25 hover:border-white/40 backdrop-blur-md transition-all duration-300 shadow-sm active:scale-95"
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
                  "group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white border backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer active:scale-95",
                  menuOpen
                    ? "bg-black/60 border-white/40"
                    : "bg-black/35 hover:bg-black/55 border-white/25 hover:border-white/40",
                )}
              >
                <span
                  className="flex flex-col justify-center gap-[3px] sm:gap-[4px] w-3 sm:w-3.5"
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                      menuOpen &&
                        "rotate-45 translate-y-[2.2px] sm:translate-y-[2.7px]",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                      menuOpen &&
                        "-rotate-45 -translate-y-[2.2px] sm:-translate-y-[2.7px]",
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
            className="mt-2.5 sm:mt-3 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl"
          />
        </div>

        {/* Hero Title Matching Design */}
        <div className="relative z-20 w-full mt-16 sm:mt-24 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-normal text-white leading-[1.06] tracking-tight drop-shadow-md select-none">
              Exclusive Properties
              <br />
              In Prime Locations
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
