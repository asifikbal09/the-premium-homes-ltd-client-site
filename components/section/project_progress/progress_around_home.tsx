"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Appear, Shutter } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";
import { cn, fluid } from "@/lib/utils";

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
    top: "33.5%",
    left: "56.3%",
  },
  {
    id: "2",
    name: "Evercare Hospital",
    distance: "5 mins",
    category: "hospital",
    top: "39%",
    left: "77.7%",
  },
  {
    id: "3",
    name: "Central Community Playground",
    distance: "2 mins",
    category: "playground",
    top: "51%",
    left: "55.9%",
  },
  {
    id: "4",
    name: "The Lakeside Cafe & Grill",
    distance: "4 mins",
    category: "restaurant",
    top: "69.5%",
    left: "67.8%",
  },
  {
    id: "5",
    name: "300ft Waterfront Dining Hub",
    distance: "6 mins",
    category: "restaurant",
    top: "61%",
    left: "88.5%",
  },
];

const CATEGORIES = [
  { id: "school", label: "School", iconSrc: "" },
  {
    id: "hospital",
    label: "Hospital",
    iconSrc: "/image/progress/icons/nearby-hospital.svg",
  },
  {
    id: "playground",
    label: "Playground",
    iconSrc: "/image/progress/icons/nearby-playground.svg",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    iconSrc: "/image/progress/icons/nearby-restaurant.svg",
  },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface ProgressAroundHomeProps {
  location?: string;
  projectName?: string;
}

function SchoolCompositeIcon({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "relative size-[40px] shrink-0 overflow-clip sm:size-[48px]",
        !active && "brightness-0 opacity-80",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="absolute inset-0 block max-w-none size-full"
        src="/image/progress/icons/school-group0.svg"
      />
      <div className="absolute inset-[68.56%_70.83%_17.39%_15.58%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          src="/image/progress/icons/school-group1.svg"
        />
      </div>
      <div className="absolute inset-[50.83%_70.83%_35.11%_15.58%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          src="/image/progress/icons/school-group2.svg"
        />
      </div>
      <div className="absolute inset-[68.56%_15.42%_17.39%_70.99%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          src="/image/progress/icons/school-group3.svg"
        />
      </div>
      <div className="absolute inset-[50.83%_15.42%_35.11%_70.99%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          src="/image/progress/icons/school-group4.svg"
        />
      </div>
      <div className="absolute inset-[50.83%_51.72%_35.11%_34.69%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          src="/image/progress/icons/school-group5.svg"
        />
      </div>
      <div className="absolute inset-[50.83%_34.69%_35.11%_51.72%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          src="/image/progress/icons/school-group6.svg"
        />
      </div>
      <div className="absolute inset-[26.37%_40.88%_55.39%_40.88%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block max-w-none size-full"
          src="/image/progress/icons/school-group7.svg"
        />
      </div>
    </div>
  );
}

export function ProgressAroundHome({
  location: _location,
  projectName = "The Home",
}: ProgressAroundHomeProps) {
  void _location;
  void projectName;
  const [activeCategory, setActiveCategory] = useState<CategoryId>("school");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  return (
    <section
      aria-label="See What's Around The Home"
      className="w-full bg-white py-[clamp(64px,6.25vw,100px)]"
    >
      <div className="shell flex flex-col gap-[40px] sm:gap-[56px]">
        {/* Section Header (Figma 8036:25245) */}
        <div className="flex max-w-[820px] flex-col items-start gap-[16px]">
          <Eyebrow className="text-[#cfa564]">nearby locations</Eyebrow>
          <Heading
            size={64}
            min={36}
            leading={1.1}
            mask
            className="text-[#054b3c]"
          >
            See what’s around the Home
          </Heading>
        </div>

        {/* Map & 4 Category Cards Block (Figma 8036:25248) */}
        <div className="flex flex-col gap-[24px]">
          {/* Map Container (1440 × 641 in Figma 8036:25249) */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f1f0ee] sm:aspect-[1440/641]">
            <Shutter className="relative size-full bg-[#f1f0ee]">
              <Image
                src="/image/progress/Group.svg"
                alt="Surrounding Map Illustration"
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover object-center"
                priority
              />
            </Shutter>

            {/* Interactive Landmark Pins (Figma 8036:25302..25314) */}
            {NEARBY_PINS.map((pin) => {
              const isMatch = pin.category === activeCategory;
              const isHovered = hoveredPin === pin.id;

              return (
                <div
                  key={pin.id}
                  style={{ top: pin.top, left: pin.left }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  onMouseEnter={() => setHoveredPin(pin.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  {isMatch && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-1.5 animate-ping rounded-full bg-[#9a8271]/35"
                      style={{ animationDuration: "2.4s" }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveCategory(pin.category)}
                    aria-label={`${pin.name} (${pin.distance})`}
                    className={cn(
                      "relative flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#9a8271] transition-transform duration-300 sm:size-[48px]",
                      isMatch
                        ? "scale-110 ring-4 ring-[#9a8271]/30"
                        : "opacity-90 hover:scale-105 hover:opacity-100",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/image/progress/icons/map-pin.svg"
                      alt=""
                      width={29}
                      height={29}
                      className="size-5 sm:size-[29px]"
                    />
                  </button>

                  {/* Tooltip */}
                  {(isMatch || isHovered) && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2.5 -translate-x-1/2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 bg-[#054b3c] px-3 py-1.5 font-sans text-[12px] text-white shadow-lg">
                        <span className="font-medium">{pin.name}</span>
                        <span className="text-[#cfa564]">({pin.distance})</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4 Category Cards (Figma 8036:25317, 354 × 112 each, gap 8px) */}
          <div className="grid grid-cols-2 gap-[8px] lg:grid-cols-4">
            {CATEGORIES.map((cat, idx) => {
              const isActive = activeCategory === cat.id;

              return (
                <Appear key={cat.id} preset="lift" delay={0.1 + idx * 0.06}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex h-[88px] w-full cursor-pointer items-center gap-[18px] border px-5 text-left transition-colors duration-300 sm:h-[112px] sm:p-[32px]",
                      isActive
                        ? "border-[#054b3c] bg-[#054b3c] text-white"
                        : "border-[#e6e6e6] bg-white text-[#3b3e40] hover:border-[#054b3c]/50",
                    )}
                  >
                    {cat.id === "school" ? (
                      <SchoolCompositeIcon active={isActive} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.iconSrc}
                        alt=""
                        width={48}
                        height={48}
                        className={cn(
                          "size-[40px] shrink-0 sm:size-[48px]",
                          isActive && "brightness-0 invert",
                        )}
                      />
                    )}

                    <span
                      className={cn(
                        "trim whitespace-nowrap font-display font-medium capitalize",
                        isActive ? "text-white" : "text-[#3b3e40]",
                      )}
                      style={{ fontSize: fluid(28, 18), lineHeight: 1.2 }}
                    >
                      {cat.label}
                    </span>
                  </button>
                </Appear>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
