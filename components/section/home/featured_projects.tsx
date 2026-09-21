"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectItem {
  id: string;
  category: string;
  title: string;
  location: string;
  description: string;
  cardImage: string;
  bgImage: string;
  cardAlt: string;
  bgAlt: string;
  href: string;
}

const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "lumina",
    category: "COMMERCIAL",
    title: "The Premium Lumina",
    location: "10/23 Bashundhara Residential Area",
    description:
      "Your fairytale honeymoon awaits at our luxurious hotel. Book now for an unforgettable experience.",
    cardImage: "/image/lumina.png",
    bgImage: "/image/studio6.png",
    cardAlt: "The Premium Lumina luxury commercial estate architectural view",
    bgAlt: "Architectural facade backdrop",
    href: "#lumina",
  },
  {
    id: "studio6",
    category: "RESIDENTIAL",
    title: "The Premium Studio Suite 6.0",
    location: "Sector 11, Uttara, Dhaka",
    description:
      "A masterpiece of contemporary architecture featuring luxury suites with panoramic city vistas and private balconies.",
    cardImage: "/image/studio6.png",
    bgImage: "/image/lumina.png",
    cardAlt: "The Premium Studio Suite 6.0 modern residential tower",
    bgAlt: "Architectural facade backdrop",
    href: "#studio6",
  },
];

export function FeaturedProjects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProject = FEATURED_PROJECTS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? FEATURED_PROJECTS.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === FEATURED_PROJECTS.length - 1 ? 0 : prev + 1,
    );
  };

  const setSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      id="projects"
      aria-label="Featured Projects Showcase"
      className="w-full bg-[#ffffff] py-8 sm:py-16 lg:py-20 selection:bg-[#d0a65b]/20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Main Showcase Container with Contained Aspect Ratio Frame */}
        <div className="relative w-full min-h-0 sm:min-h-[620px] md:min-h-[680px] lg:min-h-[740px] rounded-xs overflow-hidden shadow-2xl bg-[#041713] flex items-center justify-center lg:justify-end p-3 py-6 sm:p-8 md:p-12 lg:p-16 transition-all">
          {/* Background Architectural Image with Crossfade */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentProject.bgImage}
                  alt={currentProject.bgAlt}
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  className="object-cover object-center lg:object-[35%_center]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle atmospheric vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-black/30 pointer-events-none" />
          </div>

          {/* Floating Spotlight White Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] md:max-w-[450px] bg-white rounded-xs shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/60 p-4 sm:p-7 md:p-9 flex flex-col items-center text-center transition-all"
          >
            {/* Project Category Tag */}
            <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#055B4B] mb-1 sm:mb-2">
              {currentProject.category}
            </span>

            {/* Project Title */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${currentProject.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="font-heading text-lg sm:text-2xl md:text-[32px] font-normal text-[#1A231F] leading-[1.15] tracking-tight mb-1 sm:mb-1.5"
              >
                {currentProject.title}
              </motion.h2>
            </AnimatePresence>

            {/* Project Location */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`loc-${currentProject.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-sans text-[11px] sm:text-[13px] text-[#6B7280] font-normal tracking-wide mb-3 sm:mb-5"
              >
                {currentProject.location}
              </motion.p>
            </AnimatePresence>

            {/* Inner Project Render Image */}
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xs bg-[#F4F1EB] mb-3 sm:mb-5 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${currentProject.id}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentProject.cardImage}
                    alt={currentProject.cardAlt}
                    fill
                    sizes="(max-width: 640px) 320px, 420px"
                    className="object-cover object-center"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation & Progress Controls */}
            <div className="w-full flex items-center justify-center gap-2.5 sm:gap-4 mb-2.5 sm:mb-4 select-none">
              {/* Previous / Slide 1 Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project slide"
                className={`inline-flex items-center gap-0.5 py-1 px-1.5 text-xs font-medium cursor-pointer transition-colors ${
                  currentIndex === 0
                    ? "text-[#044133] font-semibold"
                    : "text-[#8E9792] hover:text-[#044133]"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5 -mr-0.5" />
                <span>1</span>
              </button>

              {/* Progress Track Indicator */}
              <div
                role="progressbar"
                aria-valuenow={currentIndex + 1}
                aria-valuemin={1}
                aria-valuemax={FEATURED_PROJECTS.length}
                aria-label="Project slide indicator"
                onClick={() => setSlide(currentIndex === 0 ? 1 : 0)}
                className="relative w-20 sm:w-28 h-[2.5px] bg-[#E3DFD7] rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  className="absolute top-0 bottom-0 w-1/2 bg-[#044133] rounded-full transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateX(${currentIndex * 100}%)`,
                  }}
                />
              </div>

              {/* Next / Slide 2 Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project slide"
                className={`inline-flex items-center gap-0.5 py-1 px-1.5 text-xs font-medium cursor-pointer transition-colors ${
                  currentIndex === 1
                    ? "text-[#044133] font-semibold"
                    : "text-[#8E9792] hover:text-[#044133]"
                }`}
              >
                <span>2</span>
                <ChevronRight className="w-3.5 h-3.5 -ml-0.5" />
              </button>
            </div>

            {/* Editorial Description Text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentProject.id}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="font-sans text-[11px] sm:text-[13px] text-[#526058] leading-relaxed max-w-[290px] sm:max-w-[330px] font-normal mb-4 sm:mb-6"
              >
                {currentProject.description}
              </motion.p>
            </AnimatePresence>

            {/* VIEW PROJECT CTA Button */}
            <Link
              href={currentProject.href}
              className="inline-flex items-center justify-center px-6 sm:px-10 py-2 sm:py-3 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#2A231A] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #EFE7DA 0%, #D8CDBC 100%)",
                border: "1px solid rgba(200, 186, 168, 0.45)",
              }}
            >
              VIEW PROJECT
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
