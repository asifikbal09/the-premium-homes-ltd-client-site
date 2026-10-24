"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AmenityItem {
  id: number | string;
  name: string;
  image?: string;
  img?: string;
}

interface ProgressGalleryProps {
  amenities?: AmenityItem[];
  projectImage?: string;
  projectName?: string;
}

export function ProgressGallery({
  amenities = [],
  projectImage,
  projectName = "Project",
}: ProgressGalleryProps) {
  const items = React.useMemo(() => {
    if (amenities && amenities.length > 0) {
      return amenities.map((item, idx) => ({
        id: String(item.id || idx),
        name: item.name,
        image: item.image || item.img || projectImage || "/image/progress/Gym.png",
        isCenter: idx === Math.floor(amenities.length / 2),
      }));
    }
    if (projectImage) {
      return [
        {
          id: "main",
          name: projectName,
          image: projectImage,
          isCenter: true,
        },
      ];
    }
    return [];
  }, [amenities, projectImage, projectName]);

  if (items.length === 0) return null;

  return (
    <section
      aria-label="Project Amenities & Gallery Section"
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
            AMENITIES & HIGHLIGHTS
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight">
            {projectName} Features & Lifestyle
          </h2>
        </div>

        {/* Gallery / Amenities Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center group transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-xl transition-transform duration-500 group-hover:scale-[1.03] group-hover:border-[#d0a65b]/40">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-2.5 inset-x-2.5 font-sans text-xs sm:text-sm text-white font-medium text-center drop-shadow-md">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
