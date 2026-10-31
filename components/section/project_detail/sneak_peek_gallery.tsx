"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand, X } from "lucide-react";
import { Appear, Shutter } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";
import type { ProjectAmenity } from "@/lib/projects";

interface SneakPeekGalleryProps {
  images?: string[];
  amenities?: ProjectAmenity[];
  projectName?: string;
}

/**
 * Figma staggered gallery slots (from left to right across the 2112px wide strip, centered on the
 * 400×495 Lobby frame): 200×247, 260×322, 300×371, 400×495, 300×371, 260×322, 200×247.
 */
const SLOTS = [
  { defaultTitle: "Mosque", defaultImage: "/image/gelary/Frame 2147229743.png", w: 200, h: 247 },
  { defaultTitle: "Mosque", defaultImage: "/image/gelary/Frame 2147229743.png", w: 260, h: 322 },
  { defaultTitle: "Fitness Gym", defaultImage: "/image/gelary/Frame 2147229742.png", w: 300, h: 371 },
  { defaultTitle: "lobby", defaultImage: "/image/gelary/Frame 2147229735.png", w: 400, h: 495 },
  { defaultTitle: "parking", defaultImage: "/image/gelary/Frame 2147229736.png", w: 300, h: 371 },
  { defaultTitle: "playground", defaultImage: "/image/gelary/Frame 2147229737.png", w: 260, h: 322 },
  { defaultTitle: "Park", defaultImage: "/image/gelary/Frame 2147229737.png", w: 200, h: 247 },
];

export function SneakPeekGallery({
  images = [],
  amenities = [],
  projectName = "Residence",
}: SneakPeekGalleryProps) {
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const galleryItems = SLOTS.map((slot, idx) => {
    const amenity = amenities[idx];
    const apiImg =
      amenity?.image ||
      amenity?.img ||
      (images.length > 0 ? images[idx % images.length] : "");
    return {
      id: `${slot.defaultTitle}-${idx}`,
      title: amenity?.name || slot.defaultTitle,
      image: apiImg || slot.defaultImage,
      w: slot.w,
      h: slot.h,
    };
  });

  return (
    <section
      aria-label="Sneak Peek Gallery"
      className="overflow-hidden bg-white py-[clamp(56px,6.25vw,100px)]"
    >
      <div className="shell">
        {/* Figma Centered Section Header (714 × 169) */}
        <div className="mx-auto mb-12 flex max-w-[714px] flex-col items-center gap-4 text-center sm:mb-20">
          <Eyebrow>gallery</Eyebrow>
          <Heading size={64} min={36} leading={1.1} mask>
            sneak peek from your future home
          </Heading>
        </div>
      </div>

      {/* Full-bleed staggered gallery strip */}
      <div className="mx-auto flex w-full max-w-[2112px] items-center justify-center gap-3 px-2 sm:gap-5 lg:gap-8">
        {galleryItems.map((item, idx) => {
          // Outer two slots hide on small screens so the 5 inner cards stay legible on mobile/tablet
          const hideOnMobile = idx === 0 || idx === galleryItems.length - 1;
          return (
            <figure
              key={item.id}
              style={{ flex: `${item.w} 1 0%` }}
              className={`group min-w-0 cursor-pointer flex-col items-center ${
                hideOnMobile ? "hidden xl:flex" : "flex"
              }`}
              onClick={() => setActiveModalImage(item.image)}
            >
              <Shutter
                delay={0.08 * idx}
                className="relative w-full bg-warm"
              >
                <div
                  className="zoom-frame relative w-full"
                  style={{ aspectRatio: `${item.w} / ${item.h}` }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 16vw, 22vw"
                    className="object-cover object-center"
                  />

                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex size-9 items-center justify-center rounded-full bg-white/90 text-green shadow-sm backdrop-blur-xs">
                      <Expand className="size-4" />
                    </div>
                  </div>
                </div>
              </Shutter>

              <Appear
                as="p"
                preset="lift"
                delay={0.15 + idx * 0.06}
                className="trim mt-4 text-center font-display text-[14px] font-medium capitalize leading-[1.5] text-ink sm:text-[20px]"
              >
                {item.title}
              </Appear>
            </figure>
          );
        })}
      </div>

      {/* Lightbox Preview Modal */}
      {activeModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative aspect-[16/10] max-h-[85vh] w-full max-w-5xl"
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
              className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
