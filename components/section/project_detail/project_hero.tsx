
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[680px] md:min-h-[760px] lg:min-h-[820px] flex flex-col justify-end overflow-hidden bg-[#031310] text-white pt-24 sm:pt-28 md:pt-32">
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

        {/* Subtle top header gradient for navbar legibility without dimming the photo */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />

        {/* Localized dark overlay ONLY in the bottom-left corner for the text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 65% at 0% 100%, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.25) 55%, transparent 75%)",
          }}
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
