"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";

interface SneakPeekGalleryProps {
  images?: string[];
  projectName?: string;
}

// Static for now; will be made project-wise dynamic later.
// w/h = native image size, used for proportional width + aspect ratio.
const STATIC_GALLERY_ITEMS = [
  { title: "Mosque", image: "/image/gelary/Frame 2147229743.png", w: 236, h: 356 },
  { title: "Fitness Gym", image: "/image/gelary/Frame 2147229742.png", w: 300, h: 405 },
  { title: "Lobby", image: "/image/gelary/Frame 2147229735.png", w: 400, h: 529 },
  { title: "Parking", image: "/image/gelary/Frame 2147229736.png", w: 300, h: 406 },
  { title: "Playground", image: "/image/gelary/Frame 2147229737.png", w: 236, h: 357 },
];

export function SneakPeekGallery({ projectName = "Residence" }: SneakPeekGalleryProps) {
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  return (
    <section
      aria-label="Sneak Peek Gallery"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-[#ede7dc]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Centered Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            GALLERY
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-2 tracking-tight leading-tight">
            Sneak Peek From Your <br className="hidden sm:inline" />
            Future Home
          </h2>
        </div>
      </div>

      {/* Full-width gallery row (outside max-w container) */}
      <div className="w-full flex items-center gap-2 sm:gap-4 lg:gap-6">
        {STATIC_GALLERY_ITEMS.map((item) => (
          <figure
            key={item.title}
            style={{ flex: `${item.w} 1 0%` }}
            className="min-w-0 group cursor-pointer"
            onClick={() => setActiveModalImage(item.image)}
          >
            <div
              className="relative w-full overflow-hidden bg-[#f4efe8]"
              style={{ aspectRatio: `${item.w} / ${item.h}` }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="25vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-103"
              />

              {/* Subtle Hover Overlay */}
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#044133] shadow-sm">
                  <Expand className="w-4 h-4" />
                </div>
              </div>
            </div>

            <figcaption className="font-heading text-xs sm:text-base text-[#14261f] font-normal mt-3 text-center">
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {activeModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[85vh] aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeModalImage}
              alt={projectName}
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setActiveModalImage(null)}
              aria-label="Close image preview"
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
