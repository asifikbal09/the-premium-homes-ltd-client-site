"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface CommunityImage {
  src: string;
  alt: string;
}

const COMMUNITY_IMAGES: CommunityImage[] = [
  {
    src: "/image/community/community01.png",
    alt: "Family enjoying peaceful outdoor residential courtyard",
  },
  {
    src: "/image/community/community02.png",
    alt: "Joyful parents running with young child in lush lawn garden",
  },
  {
    src: "/image/community/community03.png",
    alt: "Multi-generational family walking down landscaped garden staircase",
  },
  {
    src: "/image/community/community04.png",
    alt: "Father and son enjoying recreation time on green lawn",
  },
];

interface AmenityCategory {
  id: string;
  title: string;
  bgColor: string;
  images: {
    src: string;
    alt: string;
  }[];
}

const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    id: "rooftop-park",
    title: "Rooftop Park",
    bgColor: "#054b3c",
    images: [
      {
        src: "/image/rooftop/rooftop01.jpg",
        alt: "Rooftop park with serene poolside lounge deck and tropical foliage",
      },
      {
        src: "/image/rooftop/rooftop02.png",
        alt: "Architectural resort chalets overlooking reflecting swimming pool",
      },
      {
        src: "/image/rooftop/rooftop03.jpg",
        alt: "Sunlit recreational pool with leisure floats and umbrella deck",
      },
    ],
  },
  {
    id: "swimming-pool",
    title: "Swimming Pool",
    bgColor: "#070321",
    images: [
      {
        src: "/image/rooftop/rooftop01.jpg",
        alt: "Clear azure swimming waters surrounded by palm trees and deck chairs",
      },
      {
        src: "/image/rooftop/rooftop02.png",
        alt: "Private poolside cabanas offering relaxation and scenic views",
      },
      {
        src: "/image/rooftop/rooftop03.jpg",
        alt: "Luxury swimming pool with towel amenities and summer umbrellas",
      },
    ],
  },
  {
    id: "parking",
    title: "Parking",
    bgColor: "#571a1a",
    images: [
      {
        src: "/image/rooftop/rooftop01.jpg",
        alt: "Spacious estate parking access integrated with landscape architecture",
      },
      {
        src: "/image/rooftop/rooftop02.png",
        alt: "Covered and illuminated residential parking approach",
      },
      {
        src: "/image/rooftop/rooftop03.jpg",
        alt: "Secure multi-vehicle parking facility with clear circulation",
      },
    ],
  },
  {
    id: "fitness-zone",
    title: "Fitness Zone",
    bgColor: "#81743f",
    images: [
      {
        src: "/image/rooftop/rooftop01.jpg",
        alt: "Open-air fitness and recreation space surrounded by natural green",
      },
      {
        src: "/image/rooftop/rooftop02.png",
        alt: "Sheltered wellness deck designed for yoga, meditation, and exercise",
      },
      {
        src: "/image/rooftop/rooftop03.jpg",
        alt: "Rejuvenating outdoor training area with fresh air circulation",
      },
    ],
  },
];

export function CommunityGallery() {
  const [activeAmenityId, setActiveAmenityId] = useState<string | null>(
    "rooftop-park",
  );

  const toggleAmenity = (id: string) => {
    setActiveAmenityId((prev) => (prev === id ? null : id));
  };

  // Repeating array twice to ensure seamless right-to-left marquee loop
  const marqueeItems = [...COMMUNITY_IMAGES, ...COMMUNITY_IMAGES];

  return (
    <section className="w-full bg-[#ffffff] pt-16 sm:pt-20 md:pt-24 select-none">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12 md:mb-14">
        <p className="text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#054b3c] mb-2 sm:mb-3">
          GALLERY
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-normal text-[#1f2723] tracking-tight">
          Happy Community
        </h2>
      </div>

      {/* Looping Right-to-Left Community Images Marquee */}
      <div className="w-full overflow-hidden pb-16 sm:pb-20 md:pb-24">
        <div className="animate-marquee-rtl flex items-center gap-4 sm:gap-6 w-max">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="h-[300px] sm:h-[360px] md:h-[420px] shrink-0 overflow-hidden shadow-sm transition-transform duration-300 hover:scale-[1.01]"
            >
              {/* Native img for zero-layout-shift horizontal marquee with natural aspect ratios */}
              <img
                src={item.src}
                alt={item.alt}
                loading="eager"
                draggable={false}
                className="h-full w-auto object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Interactive Accordion */}
      <div className="w-full flex flex-col">
        {AMENITY_CATEGORIES.map((amenity) => {
          const isOpen = activeAmenityId === amenity.id;

          return (
            <div
              key={amenity.id}
              style={{ backgroundColor: amenity.bgColor }}
              className="w-full transition-colors duration-300"
            >
              {/* Accordion Bar Header */}
              <button
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-4 sm:py-6 md:py-8 px-4 sm:px-8 md:px-16 lg:px-24 text-left cursor-pointer transition-opacity hover:opacity-95 focus:outline-none"
              >
                <h3 className="font-heading text-lg sm:text-2xl md:text-3xl lg:text-4xl text-[#fdfdf8] font-light tracking-wide">
                  {amenity.title}
                </h3>
                <span className="text-[#fdfdf8] ml-2 sm:ml-4 shrink-0 transition-transform duration-200">
                  {isOpen ? (
                    <Minus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.5]" />
                  ) : (
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.5]" />
                  )}
                </span>
              </button>

              {/* Accordion Expanded Image Gallery: 3 columns on both Mobile and Desktop */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-8 md:px-16 lg:px-24 pb-5 sm:pb-8 md:pb-12 pt-1">
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                        {amenity.images.map((img, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative aspect-[4/3] w-full overflow-hidden shadow-sm md:shadow-md"
                          >
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              sizes="(max-width: 768px) 33vw, 33vw"
                              className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
