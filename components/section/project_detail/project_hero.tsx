
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavDropdownMenu } from "@/components/navbar";

interface ProjectHeroProps {
  name: string | { id?: string | number; name?: string; address?: string; slug?: string };
  image: string;
  tag?:
    | string
    | {
        id?: string | number;
        name?: string;
      }
    | null;
  location?:
    | string
    | {
        id?: string | number;
        name?: string;
        address?: string;
        slug?: string;
      }
    | null;
}

export function ProjectHero({
  name,
  image,
  tag,
  location,
}: ProjectHeroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Normalize name
  const displayName =
    typeof name === "string"
      ? name
      : name?.name || name?.slug || "";

  // Normalize tag
  const displayTag =
    typeof tag === "string"
      ? tag
      : tag?.name || "";

  // Normalize location
  const displayLocation =
    typeof location === "string"
      ? location
      : location?.address || location?.name || "";

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[680px] md:min-h-[760px] lg:min-h-[820px] flex flex-col justify-between overflow-hidden bg-[#031310] text-white">
      {/* Background Architectural Photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image || "/image/projects/projectsHero.png"}
          alt={displayName}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-102"
        />

        {/* Soft luxury cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Top Navbar */}
      <div
        ref={headerRef}
        className="relative z-30 w-full pt-4 sm:pt-6"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
            aria-label="Premium Homes Home"
          >
            <div className="relative h-8 sm:h-9 w-36 sm:w-44">
              <Image
                src="/image/logo/LOGO-WHITE.png"
                alt="Premium Homes"
                fill
                sizes="180px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Action Links & Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ALL PROJECT</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={
                isOpen
                  ? "Close Navigation Menu"
                  : "Open Navigation Menu"
              }
              aria-expanded={isOpen}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white border transition-all duration-300 shadow-sm cursor-pointer active:scale-95",
                isOpen
                  ? "bg-white/25 border-white/40"
                  : "bg-white/10 hover:bg-white/20 border-white/20"
              )}
            >
              <span
                className="flex flex-col justify-center gap-[4.5px] w-3.5"
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                    isOpen && "rotate-45 translate-y-[3px]"
                  )}
                />

                <span
                  className={cn(
                    "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                    isOpen && "-rotate-45 -translate-y-[3px]"
                  )}
                />
              </span>

              <span>MENU</span>
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        <NavDropdownMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>

      {/* Hero Headline Overlay */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pb-16 sm:pb-24 md:pb-28">
        <div className="max-w-2xl space-y-3">
          {/* Tag */}
          {displayTag && (
            <span className="inline-block text-[#d0a65b] font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase">
              {displayTag}
            </span>
          )}

          {/* Project Name */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.05]">
            {displayName}
          </h1>

          {/* Location */}
          {displayLocation && (
            <p className="text-white/80 font-light text-sm sm:text-base tracking-wide pt-1">
              {displayLocation}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
