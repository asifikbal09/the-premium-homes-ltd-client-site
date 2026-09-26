"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Top floating community cards configuration matching the design
interface FloatingCard {
  id: string;
  src: string;
  alt: string;
  className: string;
  floatY: number[];
  duration: number;
  delay: number;
}

const FLOATING_CARDS: FloatingCard[] = [
  // 1. Top Left: Family descending stairs
  {
    id: "card-top-left",
    src: "/image/community/community03.png",
    alt: "Family enjoying a peaceful morning walk",
    className:
      "top-[4%] left-[6%] sm:left-[10%] md:left-[14%] w-16 h-20 sm:w-24 sm:h-28 md:w-32 md:h-36 z-10",
    floatY: [-5, 6, -5],
    duration: 4.6,
    delay: 0.1,
  },
  // 2. Top Center: Parents with child in wheelbarrow (prominent card)
  {
    id: "card-top-center",
    src: "/image/community/community01.png",
    alt: "Parents playing with child in courtyard lawn",
    className:
      "top-[0%] left-[38%] sm:left-[41%] md:left-[43%] w-24 h-32 sm:w-36 sm:h-48 md:w-48 md:h-60 z-20",
    floatY: [-7, 8, -7],
    duration: 5.2,
    delay: 0,
  },
  // 3. Top Right: Mother and children in garden
  {
    id: "card-top-right",
    src: "/image/community/community04.png",
    alt: "Happy family outdoor recreation",
    className:
      "top-[5%] right-[5%] sm:right-[9%] md:right-[12%] w-18 h-22 sm:w-26 sm:h-32 md:w-36 md:h-44 z-10",
    floatY: [6, -6, 6],
    duration: 4.8,
    delay: 0.2,
  },
  // 4. Bottom Far-Left: Distant family in park
  {
    id: "card-bottom-left",
    src: "/image/community/community03.png",
    alt: "Peaceful neighborhood stroll",
    className:
      "bottom-[22%] left-[1%] sm:left-[3%] md:left-[5%] w-14 h-18 sm:w-20 sm:h-24 md:w-26 md:h-32 z-10",
    floatY: [-4, 5, -4],
    duration: 4.2,
    delay: 0.3,
  },
  // 5. Bottom Center-Left: Young girl walking on staircase (taller portrait)
  {
    id: "card-bottom-mid-left",
    src: "/image/community/community03.png",
    alt: "Child enjoying safe community grounds",
    className:
      "bottom-[6%] left-[22%] sm:left-[25%] md:left-[27%] w-22 h-28 sm:w-32 sm:h-40 md:w-44 md:h-56 z-20",
    floatY: [7, -7, 7],
    duration: 5.5,
    delay: 0.15,
  },
  // 6. Bottom Mid: Two boys playing with ball
  {
    id: "card-bottom-mid",
    src: "/image/community/community04.png",
    alt: "Children bonding and playing together",
    className:
      "bottom-[12%] left-[54%] sm:left-[56%] md:left-[58%] w-18 h-22 sm:w-24 sm:h-28 md:w-32 md:h-36 z-10",
    floatY: [-6, 6, -6],
    duration: 4.9,
    delay: 0.25,
  },
  // 7. Bottom Right: Parents running joyfully with toddler
  {
    id: "card-bottom-right",
    src: "/image/community/community02.png",
    alt: "Parents and toddler running playfully on green grass",
    className:
      "bottom-[16%] right-[3%] sm:right-[6%] md:right-[8%] w-18 h-22 sm:w-26 sm:h-32 md:w-36 md:h-44 z-10",
    floatY: [5, -7, 5],
    duration: 4.4,
    delay: 0.35,
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
    watermark: "pool",
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
  // Active amenity expanded state (defaults to fitness-zone matching Image 1)
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
      <div className="relative w-full max-w-[1400px] mx-auto h-[380px] sm:h-[480px] md:h-[580px] lg:h-[640px] flex items-center justify-center my-4 sm:my-8">
        {/* Giant Centered "Community" Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center px-2 pointer-events-none select-none z-0"
        >
          <span className="font-heading font-normal text-[#054b3c] text-[58px] sm:text-[96px] md:text-[138px] lg:text-[180px] xl:text-[210px] tracking-tight leading-none block">
            Community
          </span>
        </motion.div>

        {/* 7 Floating Cards positioned around and overlapping "Community" */}
        {FLOATING_CARDS.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: card.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute ${card.className}`}
          >
            <motion.div
              animate={{
                y: card.floatY,
              }}
              transition={{
                duration: card.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.08,
                transition: { duration: 0.25 },
              }}
              className="relative w-full h-full rounded-md sm:rounded-lg overflow-hidden shadow-md sm:shadow-lg bg-neutral-100 hover:shadow-2xl transition-shadow cursor-pointer"
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 120px, (max-width: 1024px) 180px, 240px"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* 3. Interactive Amenities Accordion with Giant Watermark Typography */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-6 sm:mt-10 md:mt-14">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
          {AMENITIES.map((amenity) => {
            const isActive = activeAmenityId === amenity.id;

            return (
              <motion.div
                key={amenity.id}
                layout
                onClick={() => setActiveAmenityId(amenity.id)}
                onMouseEnter={() => setActiveAmenityId(amenity.id)}
                transition={{
                  layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                }}
                className="flex items-start gap-4 sm:gap-6 md:gap-8 cursor-pointer group"
              >
                {/* Left: Image Container (Expands in height when active, slim preview strip when inactive) */}
                <motion.div
                  layout
                  className={`relative shrink-0 overflow-hidden rounded-sm transition-all duration-300 ${
                    isActive
                      ? "w-[125px] h-[115px] sm:w-[210px] sm:h-[180px] md:w-[260px] md:h-[220px] lg:w-[290px] lg:h-[250px] shadow-sm"
                      : "w-[125px] h-[36px] sm:w-[210px] sm:h-[50px] md:w-[260px] md:h-[60px] lg:w-[290px] lg:h-[65px] opacity-80 group-hover:opacity-100"
                  }`}
                >
                  <Image
                    src={amenity.src}
                    alt={amenity.alt}
                    fill
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 240px, 300px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>

                {/* Right: Title & Giant Faint Watermark Text */}
                <div className="flex-1 flex flex-col justify-start relative min-h-[36px] sm:min-h-[50px]">
                  {/* Category Title */}
                  <h3 className="font-heading text-base sm:text-xl md:text-2xl text-[#054b3c] font-normal leading-tight pt-0.5 sm:pt-1 transition-colors">
                    {amenity.title}
                  </h3>

                  {/* Giant Background Watermark Text - Animated in when active */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.span
                        key={`watermark-${amenity.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="font-heading font-light text-[#cbd5ce]/75 select-none pointer-events-none text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[125px] leading-none tracking-tight block -mt-1 sm:-mt-2 md:-mt-3"
                      >
                        {amenity.watermark}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
