"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavDropdownMenu } from "@/components/navbar";

export function BlogsHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroNavRef = useRef<HTMLDivElement>(null);

  // Close dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Close dropdown on click outside
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
      aria-label="Blogs Hero Section"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-20 sm:pb-24 md:pb-28 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] md:min-h-[460px]">
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

        {/* Hero Title & Subtitle */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20 max-w-3xl mx-auto px-4">
          <p className="text-[#C49C57] font-semibold text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-3">
            HOMEPAGE / NEWS
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal text-white leading-[1.1] tracking-tight">
            Blogs, Insights
          </h1>
          <p className="text-white/70 text-xs sm:text-sm md:text-[15px] font-light max-w-xl mx-auto mt-4 leading-relaxed">
            Our Philosophy is simple, hire great people and give them the
            resources and support to do their best work
          </p>
        </div>
      </div>
    </section>
  );
}
