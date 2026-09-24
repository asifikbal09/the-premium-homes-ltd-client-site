"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";

interface SneakPeekGalleryProps {
  images: string[];
  projectName: string;
}

export function SneakPeekGallery({
  images,
  projectName,
}: SneakPeekGalleryProps) {
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Ensure we have at least 5 images for the 5-item collage
  const defaultFallbackImages = [
    "/image/projects/projectsHero.png",
    "/image/prediction/predictionCard.png",
    "/image/prediction/predictionBg.png",
    "/image/lumina.png",
    "/image/studio6.png",
  ];

  const galleryList =
    images && images.length >= 3 ? images.slice(0, 5) : defaultFallbackImages;

  return (
    <section
      aria-label="Sneak Peek Gallery"
      className="w-full bg-[#fbf9f5] py-16 sm:py-20 lg:py-24 border-t border-[#ede7dc]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Centered Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            VISUAL WALKTHROUGH
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-1.5 tracking-tight">
            Sneak Peek From Your Future Home
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-2">
            Immerse yourself in thoughtfully curated spaces, natural textures,
            and refined luxury finishes.
          </p>
        </div>

        {/* 5-Item Gallery Strip / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {galleryList.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveModalImage(img)}
              className="group relative w-full aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f4efe8] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={img}
                alt={`${projectName} - Interior & Exterior Preview ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Hover overlay with expand icon */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#044133] shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                  <Expand className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {activeModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
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
