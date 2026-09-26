"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  name: string;
  image: string;
  heightClass: string;
  isCenter?: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "mosque",
    name: "Mosque",
    image: "/image/progress/Mosque.png",
    heightClass: "h-[240px] sm:h-[300px] md:h-[340px] lg:h-[360px]",
  },
  {
    id: "gym",
    name: "Fitness Gym",
    image: "/image/progress/Gym.png",
    heightClass: "h-[280px] sm:h-[350px] md:h-[400px] lg:h-[430px]",
  },
  {
    id: "lobby",
    name: "Lobby",
    image: "/image/progress/Lobby.png",
    heightClass: "h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px]",
    isCenter: true,
  },
  {
    id: "parking",
    name: "Parking",
    image: "/image/progress/parking.png",
    heightClass: "h-[280px] sm:h-[350px] md:h-[400px] lg:h-[430px]",
  },
  {
    id: "playground",
    name: "Playground",
    image: "/image/progress/playground.png",
    heightClass: "h-[240px] sm:h-[300px] md:h-[340px] lg:h-[360px]",
  },
];

export function ProgressGallery() {
  return (
    <section
      aria-label="Project Gallery Section"
      className="w-full bg-[#061d16] bg-[radial-gradient(ellipse_100%_80%_at_50%_25%,#092e24_0%,#061d16_65%,#03130f_100%)] text-white py-16 sm:py-20 md:py-28 overflow-hidden relative"
    >
      {/* Subtle Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(208, 166, 91, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 md:mb-16">
          <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.24em] uppercase mb-3">
            GALLERY
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight">
            Project Gallery
          </h2>
        </div>

        {/* 5-Card Curved Architectural Showcase */}
        <div className="overflow-x-auto pb-6 scrollbar-none">
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 min-w-[850px] lg:min-w-0">
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex-1 flex flex-col items-center group transition-all duration-300",
                  item.isCenter ? "max-w-[320px]" : "max-w-[240px]"
                )}
              >
                {/* Image Frame */}
                <div
                  className={cn(
                    "relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:border-white/25",
                    item.heightClass
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 320px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Caption below */}
                <span className="mt-3.5 font-sans text-xs sm:text-sm text-white/80 font-light tracking-wide text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
