"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  School as SchoolIcon,
  Cross,
  Coffee,
  Trees,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryPin {
  id: string;
  name: string;
  distance: string;
  category: "school" | "hospital" | "playground" | "restaurant";
  top: string;
  left: string;
}

const NEARBY_PINS: CategoryPin[] = [
  {
    id: "1",
    name: "International Hope School",
    distance: "3 mins",
    category: "school",
    top: "34%",
    left: "56%",
  },
  {
    id: "2",
    name: "Apollo / Evercare Hospital",
    distance: "5 mins",
    category: "hospital",
    top: "43%",
    left: "76%",
  },
  {
    id: "3",
    name: "Central Community Playground",
    distance: "2 mins",
    category: "playground",
    top: "53%",
    left: "56%",
  },
  {
    id: "4",
    name: "The Lakeside Cafe & Grill",
    distance: "4 mins",
    category: "restaurant",
    top: "69%",
    left: "67%",
  },
  {
    id: "5",
    name: "300ft Waterfront Dining Hub",
    distance: "6 mins",
    category: "restaurant",
    top: "65%",
    left: "88%",
  },
];

const CATEGORIES = [
  { id: "school", label: "School", icon: SchoolIcon },
  { id: "hospital", label: "Hospital", icon: Cross },
  { id: "playground", label: "Playground", icon: Trees },
  { id: "restaurant", label: "Restaurant", icon: Coffee },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

export function ProgressAroundHome() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("school");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  return (
    <section
      aria-label="See What's Around The Home"
      className="w-full bg-[#ffffff] py-16 sm:py-20 md:py-24 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-2 sm:mb-3">
            NEARBY LOCATIONS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#083327] tracking-tight">
            See What&apos;s Around The Home
          </h2>
        </div>

        {/* Map Container */}
        <div className="relative w-full aspect-[16/8.5] sm:aspect-[16/7.5] rounded-2xl overflow-hidden bg-[#f1f0ee] border border-black/10 shadow-xs">
          {/* Map Graphic Layer */}
          <div className="absolute inset-0">
            <Image
              src="/image/progress/Group.svg"
              alt="Surrounding Map Illustration"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Interactive Landmark Pins */}
          {NEARBY_PINS.map((pin) => {
            const isMatch = pin.category === activeCategory;
            const isHovered = hoveredPin === pin.id;

            return (
              <div
                key={pin.id}
                style={{ top: pin.top, left: pin.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                onMouseEnter={() => setHoveredPin(pin.id)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {/* Pin Circle Marker matching design */}
                <button
                  type="button"
                  aria-label={`${pin.name} (${pin.distance})`}
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer",
                    isMatch
                      ? "bg-[#916b47] text-white scale-110 ring-4 ring-[#916b47]/30"
                      : "bg-[#916b47]/85 text-white hover:scale-105 opacity-80"
                  )}
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-[#916b47]" />
                </button>

                {/* Tooltip on hover or when category matches */}
                {(isMatch || isHovered) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-30 whitespace-nowrap">
                    <div className="bg-[#083327] text-white px-3 py-1.5 rounded-lg text-[11px] font-sans shadow-xl border border-white/10 flex items-center gap-1.5 animate-fadeIn">
                      <span className="font-medium">{pin.name}</span>
                      <span className="text-[#d0a65b]">({pin.distance})</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Category Tabs Row (4 connected sections) */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 rounded-xl sm:rounded-2xl overflow-hidden border border-black/10 shadow-xs bg-white">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center justify-center gap-3 py-4 sm:py-5 px-4 transition-all duration-200 cursor-pointer select-none",
                  idx > 0 && "border-t md:border-t-0 md:border-l border-black/10",
                  isActive
                    ? "bg-[#063b2f] text-white font-medium"
                    : "bg-white text-[#083327] hover:bg-black/[0.02]"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "text-white" : "text-[#083327]"
                  )}
                />
                <span className="font-heading text-base sm:text-lg tracking-wide">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
