"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideItem {
  id: string;
  src: string;
  alt: string;
  imgClass: string;
}

const SLIDES: SlideItem[] = [
  // 1. Handover ceremony with green folder and TPHL logo (Front card in design)
  {
    id: "slide-1",
    src: "/image/about/about_slide01.png",
    alt: "The Premium Homes Ltd leadership and client contract handover ceremony",
    imgClass: "object-[center_32%]",
  },
  // 2. Illuminated golden "TPHL" logo wall (Tier 1 behind front card in design)
  {
    id: "slide-2",
    src: "/image/about/about_hero03.png",
    alt: "TPHL corporate headquarters milestone celebration with illuminated logo",
    imgClass: "object-[center_16%]",
  },
  // 3. Modern tower and director smiling (Tier 2 behind Tier 1 in design)
  {
    id: "slide-3",
    src: "/image/about/about_slide03.png",
    alt: "Architectural residential tower and development director at The Premium Homes Ltd",
    imgClass: "object-[center_18%]",
  },
  // 4. Collaborative team lunch gathering (Tier 3 top-most behind Tier 2 in design)
  {
    id: "slide-4",
    src: "/image/about/about_hero05.png",
    alt: "Collaborative executive team discussion and company culture",
    imgClass: "object-[center_18%]",
  },
];

interface TierConfig {
  width: string;
  y: number;
  yMobile: number;
  zIndex: number;
  brightness: number;
  overlayOpacity: number;
  shadow: string;
}

// Exact proportional measurements extracted from reference design image:
// Tier 0 (Front): 100% width, 0px Y
// Tier 1: 70.2% width, -24px Y
// Tier 2: 50.6% width, -50px Y
// Tier 3: 36.0% width, -74px Y
const TIERS: TierConfig[] = [
  {
    width: "100%",
    y: 0,
    yMobile: 0,
    zIndex: 40,
    brightness: 1,
    overlayOpacity: 0,
    shadow:
      "0 24px 50px -10px rgba(0, 0, 0, 0.22), 0 10px 20px -8px rgba(0, 0, 0, 0.12)",
  },
  {
    width: "70.2%",
    y: -24,
    yMobile: -18,
    zIndex: 30,
    brightness: 0.94,
    overlayOpacity: 0.08,
    shadow: "0 18px 40px -10px rgba(0, 0, 0, 0.18)",
  },
  {
    width: "50.6%",
    y: -50,
    yMobile: -36,
    zIndex: 20,
    brightness: 0.88,
    overlayOpacity: 0.16,
    shadow: "0 14px 30px -8px rgba(0, 0, 0, 0.15)",
  },
  {
    width: "36%",
    y: -74,
    yMobile: -54,
    zIndex: 10,
    brightness: 0.82,
    overlayOpacity: 0.25,
    shadow: "0 8px 20px -6px rgba(0, 0, 0, 0.12)",
  },
];

export function AboutFamilySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Autoplay: changes slide every 2 seconds in a continuous loop
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  return (
    <section
      aria-label="Designed for families. Scaled for tomorrow."
      className="relative w-full bg-[#f9f5ef] text-[#1f2723] overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 selection:bg-[#d0a65b]/25 selection:text-[#044133]"
    >
      {/* ========================================================= */}
      {/* 1. INFINITE MARQUEE TITLE (Slow continuous right-to-left) */}
      {/* ========================================================= */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none mb-6 sm:mb-10 md:mb-14">
        <div
          className="animate-marquee-rtl flex items-center shrink-0 will-change-transform"
          style={{ animationDuration: "45s" }}
        >
          {/* First Track (50% width) */}
          <div className="flex shrink-0 items-center">
            {[...Array(2)].map((_, idx) => (
              <span
                key={`track1-${idx}`}
                className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[112px] xl:text-[136px] font-normal text-[#054b3c] tracking-tight leading-none px-6 sm:px-10 whitespace-nowrap"
              >
                Designed For Families. Scaled for tomorrow.
              </span>
            ))}
          </div>

          {/* Second Track (Identical duplicate for seamless continuous loop) */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {[...Array(2)].map((_, idx) => (
              <span
                key={`track2-${idx}`}
                className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[112px] xl:text-[136px] font-normal text-[#054b3c] tracking-tight leading-none px-6 sm:px-10 whitespace-nowrap"
              >
                Designed For Families. Scaled for tomorrow.
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 3D CASCADING CARD SLIDER / STACKED CAROUSEL SHOWCASE   */}
      {/* ========================================================= */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 w-full">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 pt-20 sm:pt-24 md:pt-28 pb-4">
          {/* Left: Dynamic Slide Number Display (e.g. 01/04) */}
          <div className="hidden md:flex flex-1 justify-start">
            <span className="font-heading text-2xl sm:text-3xl text-[#3b3e40] tracking-wider select-none font-normal">
              {String(activeIndex + 1).padStart(2, "0")}/
              {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          {/* Center: 3D Cascading Stacked Cards Container */}
          <div
            className="w-full max-w-[440px] sm:max-w-[540px] md:max-w-[580px] lg:max-w-[620px] aspect-[16/11] relative mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {mounted ? (
              SLIDES.map((slide, index) => {
                // Calculate position in the 4-tier cascade:
                // 0 = Front active card
                // 1 = Tier 1 behind front
                // 2 = Tier 2 behind Tier 1
                // 3 = Tier 3 top-most behind Tier 2
                const slot = (index - activeIndex + SLIDES.length) % SLIDES.length;
                const tier = TIERS[slot];
                const isFront = slot === 0;

                return (
                  <motion.div
                    key={slide.id}
                    onClick={() => {
                      if (!isFront) goToSlide(index);
                    }}
                    initial={false}
                    animate={{
                      width: tier.width,
                      y: isMobile ? tier.yMobile : tier.y,
                      zIndex: tier.zIndex,
                      boxShadow: tier.shadow,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1], // Smooth luxury ease-out
                    }}
                    drag={isFront ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -45) handleNext();
                      else if (info.offset.x > 45) handlePrev();
                    }}
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-full rounded-2xl overflow-hidden select-none border border-black/[0.06] bg-[#eae5dc] will-change-transform",
                      isFront
                        ? "cursor-grab active:cursor-grabbing"
                        : "cursor-pointer hover:border-black/20 transition-colors"
                    )}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 580px, 620px"
                        priority={index === 0}
                        className={cn("object-cover select-none", slide.imgClass)}
                        draggable={false}
                      />

                      {/* Subtle Darkening Overlay for Depth on Stacked Tiers */}
                      <motion.div
                        animate={{ opacity: tier.overlayOpacity }}
                        transition={{ duration: 0.55 }}
                        className="absolute inset-0 bg-[#000000] pointer-events-none"
                      />

                      {/* Top Edge Highlight for Photorealistic Card Depth */}
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/20 pointer-events-none" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              /* Fallback static layout while mounting on client */
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-black/[0.06] bg-[#eae5dc]">
                <Image
                  src={SLIDES[0].src}
                  alt={SLIDES[0].alt}
                  fill
                  sizes="620px"
                  priority
                  className="object-cover object-[center_32%]"
                />
              </div>
            )}
          </div>

          {/* Right: Borderless Text Controls (Prev / Next) */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex items-center gap-2.5 font-heading text-2xl sm:text-3xl text-[#3b3e40] font-normal select-none">
              <button
                type="button"
                onClick={handlePrev}
                className="cursor-pointer transition-colors duration-200 hover:text-[#044133] focus:outline-none bg-transparent border-0 p-0"
                aria-label="Previous slide"
              >
                Prev
              </button>
              <span className="text-[#3b3e40]/40 font-serif text-xl sm:text-2xl font-light">
                /
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="cursor-pointer transition-colors duration-200 hover:text-[#044133] focus:outline-none bg-transparent border-0 p-0"
                aria-label="Next slide"
              >
                Next
              </button>
            </div>
          </div>

          {/* Mobile Slide Counter & Controls Row (below the cards) */}
          <div className="flex md:hidden items-center justify-between w-full max-w-[440px] px-2 pt-2">
            <span className="font-heading text-xl text-[#3b3e40] tracking-wider select-none font-normal">
              {String(activeIndex + 1).padStart(2, "0")}/
              {String(SLIDES.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2 font-heading text-xl text-[#3b3e40] font-normal select-none">
              <button
                type="button"
                onClick={handlePrev}
                className="cursor-pointer transition-colors duration-200 hover:text-[#044133] focus:outline-none bg-transparent border-0 p-0"
                aria-label="Previous slide"
              >
                Prev
              </button>
              <span className="text-[#3b3e40]/40 font-serif text-lg font-light">
                /
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="cursor-pointer transition-colors duration-200 hover:text-[#044133] focus:outline-none bg-transparent border-0 p-0"
                aria-label="Next slide"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
