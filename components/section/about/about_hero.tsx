"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  className: string;
  floatOffset: number;
  floatDuration: number;
  delay: number;
}

const GALLERY_IMAGES: GalleryImage[] = [
  // 1. Far-Left: Office meeting
  {
    id: "hero-lunch",
    src: "/image/about/about_hero05.png",
    alt: "TPHL team gathering and lunch discussion",
    className:
      "top-[22%] left-[2%] w-[14%] xl:w-[13.5%] max-w-[205px] min-w-[140px] aspect-[4/5]",
    floatOffset: -8,
    floatDuration: 6.2,
    delay: 0.15,
  },
  // 2. Mid-Left: Team reviewing architectural scale model
  {
    id: "hero-model",
    src: "/image/about/about_hero04.png",
    alt: "TPHL architects and project directors analyzing master plan scale model",
    className:
      "top-[32%] left-[17.5%] w-[15.5%] xl:w-[15%] max-w-[230px] min-w-[155px] aspect-[4/5]",
    floatOffset: 8,
    floatDuration: 7.1,
    delay: 0.35,
  },
  // 3. Center-Top: Celebration cake cutting under TPHL sign (focal centerpiece)
  {
    id: "hero-cake",
    src: "/image/about/about_hero03.png",
    alt: "TPHL milestone celebration and team cake cutting",
    className:
      "top-[10%] left-[38.5%] w-[21.5%] xl:w-[21%] max-w-[320px] min-w-[220px] aspect-[4/5] z-10",
    floatOffset: -10,
    floatDuration: 8.0,
    delay: 0.05,
  },
  // 4. Center-Right: Excellence in Leadership award ceremony
  {
    id: "hero-award",
    src: "/image/about/about_hero02.png",
    alt: "Excellence in Leadership recognition and award presentation ceremony",
    className:
      "top-[14%] left-[62%] w-[14.5%] xl:w-[14%] max-w-[215px] min-w-[150px] aspect-[4/5]",
    floatOffset: 9,
    floatDuration: 6.6,
    delay: 0.25,
  },
  // 5. Far-Right: Team in festive traditional attire celebrating together
  {
    id: "hero-festive",
    src: "/image/about/about_hero01.png",
    alt: "TPHL team festival and cultural celebration in traditional attire",
    className:
      "top-[36%] right-[2.5%] w-[14%] xl:w-[13.5%] max-w-[205px] min-w-[140px] aspect-[4/5]",
    floatOffset: -7,
    floatDuration: 7.4,
    delay: 0.45,
  },
];

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle interactive mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const moveX1 = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const moveY1 = useTransform(springY, [-0.5, 0.5], [-10, 10]);

  const moveX2 = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const moveY2 = useTransform(springY, [-0.5, 0.5], [12, -12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="About Us Hero"
      className="relative w-full bg-[#ffffff] text-[#1f2723] overflow-hidden selection:bg-[#d0a65b]/25 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20"
    >
      {/* Subtle Luxury Ambient Background Light */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(208, 166, 91, 0.07) 0%, transparent 60%), radial-gradient(circle at 20% 70%, rgba(4, 65, 51, 0.03) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* ================================================================ */}
      {/* DESKTOP HERO CANVAS (lg and above): Matches the exact visual     */}
      {/* composition of the design reference with rich fluid animations.  */}
      {/* ================================================================ */}
      <div className="hidden lg:block relative z-10 w-full max-w-[1520px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-6 xl:pt-8 min-h-[760px] xl:min-h-[820px] 2xl:min-h-[860px]">
        {/* Floating Images Composition */}
        <div className="relative w-full h-[540px] xl:h-[590px] 2xl:h-[620px]">
          {GALLERY_IMAGES.map((img, index) => {
            const parallaxX = index % 2 === 0 ? moveX1 : moveX2;
            const parallaxY = index % 2 === 0 ? moveY1 : moveY2;

            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.88, y: 35 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: img.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "absolute group cursor-pointer transition-shadow duration-300",
                  img.className,
                )}
                style={{ x: parallaxX, y: parallaxY }}
              >
                {/* Continuous Organic Floating Motion Wrapper */}
                <motion.div
                  animate={{
                    y: [0, img.floatOffset, 0],
                  }}
                  transition={{
                    duration: img.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="relative w-full h-full rounded-md overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_36px_rgba(4,65,51,0.16)] border border-black/[0.05] bg-neutral-100 transition-all duration-300"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1280px) 240px, 320px"
                    priority={img.id === "hero-cake"}
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Lower Row: Narrative & CTA (Left) + Editorial Heading (Center-Right under cake image) */}
        <div className="grid grid-cols-12 gap-8 items-end relative -mt-28 xl:-mt-32 2xl:-mt-36 z-20 pointer-events-none">
          {/* Bottom Left: Mission Copy & Join Our Team Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-5 xl:col-span-4 pointer-events-auto pb-2 xl:pb-4"
          >
            <p className="font-sans text-[13px] xl:text-[14px] leading-relaxed text-[#526058] max-w-[360px] mb-5">
              TPHL Is Shaping Accessible Premium Living In Bangladesh Through
              Honest Communication, Structured Buying Journeys, And Homes
              Designed Around Real Families.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#044133] hover:bg-[#055b4b] text-[#fdfdf8] text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 group"
            >
              <span>JOIN OUR TEAM</span>
            </Link>
          </motion.div>

          {/* Center-Right Headline: "Story Of A Dream" - aligned directly under the center cake photo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-7 xl:col-span-8 flex flex-col items-start justify-end pointer-events-auto pl-2 xl:pl-6"
          >
            <h1 className="font-heading text-[#044133] font-normal leading-[0.88] xl:leading-[0.86] tracking-[-0.02em] select-none">
              <span className="block text-[72px] xl:text-[96px] 2xl:text-[116px]">
                Story Of
              </span>
              <span className="block text-[72px] xl:text-[96px] 2xl:text-[116px]">
                A Dream
              </span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE / TABLET VIEW (< lg): Fluid, beautiful, touch-friendly     */}
      {/* ================================================================ */}
      <div className="lg:hidden relative z-10 w-full px-5 sm:px-8 pt-8 flex flex-col gap-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center sm:text-left"
        >
          <span className="text-[#C49C57] font-semibold text-xs tracking-[0.2em] uppercase mb-2 block">
            ABOUT TPHL
          </span>
          <h1 className="font-heading text-[#044133] text-5xl sm:text-6xl md:text-7xl font-normal leading-[0.92] tracking-tight">
            Story Of
            <br />
            A Dream
          </h1>
        </motion.div>

        {/* Gallery Carousel / Grid */}
        <div className="relative w-full">
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory -mx-5 px-5 sm:-mx-8 sm:px-8">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="shrink-0 snap-center w-[230px] sm:w-[270px] aspect-[4/5] rounded-md overflow-hidden shadow-md border border-black/10 relative bg-neutral-100"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="270px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Narrative & Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-start gap-5 max-w-lg"
        >
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#526058]">
            TPHL Is Shaping Accessible Premium Living In Bangladesh Through
            Honest Communication, Structured Buying Journeys, And Homes
            Designed Around Real Families.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#044133] hover:bg-[#055b4b] text-[#fdfdf8] text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-md active:scale-95"
          >
            JOIN OUR TEAM
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
