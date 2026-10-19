"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Top floating community cards configuration matching the 1600x1080 Figma design
interface FloatingCard {
  id: string;
  src: string;
  alt: string;
  className: string;
  floatY: number[];
  rotate: number[];
  duration: number;
  delay: number;
  zIndex: string;
}

const FLOATING_CARDS: FloatingCard[] = [
  // 1. Top Left: Family descending stone stairs (above "o" and left edge of "m")
  {
    id: "card-top-left",
    src: "/image/community/community03.png",
    alt: "Family enjoying a peaceful morning walk",
    className:
      "top-[4%] sm:top-[6%] md:top-[6%] lg:top-[5%] left-[8%] sm:left-[11%] md:left-[13%] lg:left-[14%] w-16 h-20 sm:w-24 sm:h-30 md:w-32 md:h-40 lg:w-44 lg:h-56 xl:w-52 xl:h-64",
    floatY: [-5, 6, -5],
    rotate: [-0.6, 0.6, -0.6],
    duration: 4.6,
    delay: 0.1,
    zIndex: "z-10",
  },
  // 2. Top Center: Parents with child in wheelbarrow (prominent card centered over "m m", overlapping top curve)
  {
    id: "card-top-center",
    src: "/image/community/community01.png",
    alt: "Parents playing with child in courtyard lawn",
    className:
      "top-[1%] sm:top-[2%] md:top-[1%] lg:top-[1%] xl:top-[2%] left-[36%] sm:left-[38%] md:left-[39%] lg:left-[40%] xl:left-[41%] w-24 h-32 sm:w-36 sm:h-48 md:w-48 md:h-64 lg:w-64 lg:h-82 xl:w-72 xl:h-92",
    floatY: [-7, 8, -7],
    rotate: [0.5, -0.5, 0.5],
    duration: 5.2,
    delay: 0,
    zIndex: "z-20",
  },
  // 3. Top Right: Happy family outdoor recreation (above "t" and "y")
  {
    id: "card-top-right",
    src: "/image/community/community04.png",
    alt: "Happy family outdoor recreation in sunny park",
    className:
      "top-[5%] sm:top-[6%] md:top-[6%] lg:top-[5%] right-[5%] sm:right-[7%] md:right-[9%] lg:right-[10%] xl:right-[11%] w-18 h-22 sm:w-26 sm:h-32 md:w-36 md:h-46 lg:w-48 lg:h-60 xl:w-56 xl:h-68",
    floatY: [6, -6, 6],
    rotate: [-0.8, 0.8, -0.8],
    duration: 4.8,
    delay: 0.2,
    zIndex: "z-10",
  },
  // 4. Bottom Far-Left: Distant family stroll (under "C")
  {
    id: "card-bottom-left",
    src: "/image/community/community03.png",
    alt: "Peaceful neighborhood stroll under garden trees",
    className:
      "bottom-[18%] sm:bottom-[17%] md:bottom-[16%] lg:bottom-[15%] left-[2%] sm:left-[3%] md:left-[4%] lg:left-[5%] xl:left-[5%] w-14 h-18 sm:w-20 sm:h-26 md:w-28 md:h-36 lg:w-36 lg:h-46 xl:w-44 xl:h-54",
    floatY: [-4, 5, -4],
    rotate: [0.4, -0.4, 0.4],
    duration: 4.2,
    delay: 0.3,
    zIndex: "z-10",
  },
  // 5. Bottom Center-Left: Young girl walking on staircase (taller portrait under first "m")
  {
    id: "card-bottom-mid-left",
    src: "/image/community/community03.png",
    alt: "Child enjoying safe community grounds stairs",
    className:
      "bottom-[5%] sm:bottom-[4%] md:bottom-[4%] lg:bottom-[3%] xl:bottom-[3%] left-[21%] sm:left-[23%] md:left-[24%] lg:left-[24%] xl:left-[25%] w-20 h-28 sm:w-30 sm:h-42 md:w-42 md:h-56 lg:w-54 lg:h-74 xl:w-62 xl:h-86",
    floatY: [7, -7, 7],
    rotate: [-0.5, 0.5, -0.5],
    duration: 5.5,
    delay: 0.15,
    zIndex: "z-20",
  },
  // 6. Bottom Mid: Two boys playing with ball (under junction of "u" and "n")
  {
    id: "card-bottom-mid",
    src: "/image/community/community04.png",
    alt: "Children bonding and playing with ball outdoors",
    className:
      "bottom-[3%] sm:bottom-[3%] md:bottom-[2%] lg:bottom-[2%] xl:bottom-[2%] left-[45%] sm:left-[46%] md:left-[46%] lg:left-[46%] xl:left-[46%] w-16 h-20 sm:w-24 sm:h-30 md:w-32 md:h-42 lg:w-44 lg:h-56 xl:w-52 xl:h-64",
    floatY: [-6, 6, -6],
    rotate: [0.6, -0.6, 0.6],
    duration: 4.9,
    delay: 0.25,
    zIndex: "z-10",
  },
  // 7. Bottom Right: Parents running playfully with toddler (under "t" and "y")
  {
    id: "card-bottom-right",
    src: "/image/community/community02.png",
    alt: "Parents and toddler running playfully on green grass",
    className:
      "bottom-[12%] sm:bottom-[11%] md:bottom-[10%] lg:bottom-[9%] xl:bottom-[8%] right-[3%] sm:right-[5%] md:right-[6%] lg:right-[7%] xl:right-[8%] w-18 h-22 sm:w-26 sm:h-32 md:w-36 md:h-46 lg:w-48 lg:h-60 xl:w-56 xl:h-70",
    floatY: [5, -7, 5],
    rotate: [-0.6, 0.6, -0.6],
    duration: 4.4,
    delay: 0.35,
    zIndex: "z-10",
  },
];

// Interactive Amenities List configuration matching Figma Mockup
interface AmenityItem {
  id: string;
  title: string;
  watermark: string;
  src: string;
  alt: string;
}

const AMENITIES: AmenityItem[] = [
  {
    id: "rooftop-park",
    title: "Rooftop Park",
    watermark: "Park",
    src: "/image/community/amenity_rooftop.png",
    alt: "Rooftop park with panoramic city skyline view and landscaped planters",
  },
  {
    id: "swimming-pool",
    title: "Swimming pool",
    watermark: "Pool",
    src: "/image/community/amenity_pool.png",
    alt: "Lush infinity swimming pool overlooking city horizon",
  },
  {
    id: "parking",
    title: "Parking",
    watermark: "Car",
    src: "/image/community/amenity_parking.png",
    alt: "Multi-level covered architectural residential parking structure",
  },
  {
    id: "fitness-zone",
    title: "Fitness Zone",
    watermark: "Play",
    src: "/image/community/amenity_fitness.png",
    alt: "Open-air fitness pavilion with modern cardio machines and training area",
  },
];

export function CommunityGallery() {
  // Active amenity expanded state (defaults to fitness-zone matching Figma design)
  const [activeAmenityId, setActiveAmenityId] = useState<string>("fitness-zone");

  return (
    <section
      id="reviews"
      className="w-full bg-[#ffffff] pt-14 sm:pt-20 md:pt-24 pb-16 sm:pb-24 select-none overflow-hidden"
    >
      {/* 1. Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#b58a59] mb-2 sm:mb-3"
        >
          GALLERY
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-heading font-normal text-[#054b3c] tracking-tight"
        >
          Creating Better Living
        </motion.h2>
      </div>

      {/* 2. Floating Community Cards Over Giant Typography */}
      <div className="relative w-full max-w-[1600px] mx-auto h-[440px] sm:h-[560px] md:h-[700px] lg:h-[840px] xl:h-[960px] 2xl:h-[1080px] flex items-center justify-center my-6 sm:my-10 lg:my-14 overflow-hidden">
        {/* Giant Centered "Community" Text matching Figma specs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center px-2 pointer-events-none select-none z-0"
        >
          <span
            style={{ fontFamily: "var(--font-victor), 'K Victor Trial', serif" }}
            className="font-normal text-[#05483C] text-[68px] sm:text-[112px] md:text-[164px] lg:text-[224px] xl:text-[284px] 2xl:text-[332px] tracking-tight leading-none block capitalize select-none"
          >
            Community
          </span>
        </motion.div>

        {/* 7 Floating Cards positioned around and overlapping "Community" */}
        {FLOATING_CARDS.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.7,
              delay: card.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute ${card.className} ${card.zIndex}`}
          >
            <motion.div
              animate={{
                y: card.floatY,
                rotate: card.rotate,
              }}
              transition={{
                duration: card.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.06,
                zIndex: 30,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="relative w-full h-full overflow-hidden shadow-md sm:shadow-lg bg-neutral-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 240px, 340px"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* 3. Interactive Amenities Accordion with Giant Watermark Typography (1464px Figma Frame) */}
      <div className="w-full max-w-[1464px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-24">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
          {AMENITIES.map((amenity) => {
            const isActive = activeAmenityId === amenity.id;

            return (
              <div
                key={amenity.id}
                onClick={() => setActiveAmenityId(amenity.id)}
                className="flex flex-col md:flex-row items-start md:items-stretch gap-4 md:gap-[40px] py-2 sm:py-3 cursor-pointer group w-full"
              >
                {/* Left: Image Container (Smooth height transition without layout shift) */}
                <div
                  className={cn(
                    "relative w-full md:w-[480px] lg:w-[540px] xl:w-[588px] shrink-0 overflow-hidden shadow-sm bg-neutral-100 transition-[height,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive
                      ? "h-[280px] sm:h-[400px] md:h-[480px] lg:h-[600px] opacity-100 shadow-md"
                      : "h-[80px] sm:h-[95px] md:h-[110px] lg:h-[125px] opacity-80 group-hover:opacity-100"
                  )}
                >
                  <Image
                    src={amenity.src}
                    alt={amenity.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 540px, 588px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Right: Title & Giant Watermark Typography */}
                <div className="flex-1 flex flex-col justify-between self-stretch relative w-full overflow-hidden min-h-[80px] sm:min-h-[95px] md:min-h-[110px] lg:min-h-[125px]">
                  {/* Category Title - Vertically aligned with collapsed image strip */}
                  <div className="h-[80px] sm:h-[95px] md:h-[110px] lg:h-[125px] flex items-center">
                    <h3
                      style={{ fontFamily: "var(--font-victor), 'K Victor Trial', serif" }}
                      className={cn(
                        "font-normal text-2xl sm:text-3xl lg:text-[36px] leading-tight transition-colors duration-300",
                        isActive ? "text-[#05483C]" : "text-[#05483C]/70 group-hover:text-[#05483C]"
                      )}
                    >
                      {amenity.title}
                    </h3>
                  </div>

                  {/* Giant Watermark Typography - Stretches at bottom of active row matching Figma */}
                  <div
                    className={cn(
                      "w-full select-none pointer-events-none mt-auto flex items-end overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive
                        ? "opacity-20 translate-y-0 max-h-[420px]"
                        : "opacity-0 translate-y-6 max-h-0 pointer-events-none"
                    )}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-victor), 'K Victor Trial', serif",
                        color: "#546360",
                      }}
                      className="block font-normal text-[80px] sm:text-[140px] md:text-[200px] lg:text-[280px] xl:text-[340px] 2xl:text-[400px] leading-[0.88] tracking-tight select-none"
                    >
                      {amenity.watermark}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
