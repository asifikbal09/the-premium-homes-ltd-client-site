"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Layers } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  tag?: string | null;
  status?: string;
}

export function ProjectGallery({
  images,
  title,
  tag = "LUXURY COLLECTION",
  status,
}: ProjectGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["/image/projects/projectsHero.png"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeImage = safeImages[selectedIndex] || safeImages[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Featured Main Image Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] max-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f4efe8] shadow-md border border-[#ede7dc]">
        {/* Top Floating Badges */}
        <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-10 flex flex-wrap items-center gap-2">
          {tag && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-white bg-black/50 backdrop-blur-md border border-white/20 shadow-xs">
              {tag}
            </span>
          )}
          {status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase text-[#044133] bg-[#f7e7cb] border border-[#d0a65b]/40 shadow-xs">
              {status}
            </span>
          )}
        </div>

        {/* Counter & Fullscreen Action */}
        <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-10 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-white bg-black/50 backdrop-blur-md border border-white/20">
            <Layers className="w-3.5 h-3.5 text-[#d0a65b]" />
            <span>
              {selectedIndex + 1} / {safeImages.length}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Expand photo"
            className="p-1.5 rounded-full text-white bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70 transition-all cursor-pointer"
          >
            <Expand className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Image with Smooth Fade */}
        <Image
          src={activeImage}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1440px) 100vw, 1440px"
          className="object-cover object-center transition-all duration-500 ease-out"
        />

        {/* Navigation Arrow Controls (if multiple images) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#044133] backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#044133] backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {safeImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Select photo ${idx + 1}`}
                className={`relative shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-[#044133] ring-2 ring-[#d0a65b]/60 scale-102"
                    : "border-transparent opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="flex items-center justify-between text-white z-10">
            <h4 className="font-heading text-xl sm:text-2xl font-light">
              {title}
            </h4>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs tracking-wider uppercase font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>

          <div
            className="relative flex-1 w-full max-w-6xl mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={title}
              fill
              className="object-contain"
            />
          </div>

          {safeImages.length > 1 && (
            <div
              className="flex items-center justify-center gap-4 text-white z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-xs sm:text-sm font-medium tracking-widest uppercase">
                {selectedIndex + 1} OF {safeImages.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

