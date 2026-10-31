"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Expand, X } from "lucide-react";
import { Appear, Shutter } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";

interface AmenityItem {
  id: number | string;
  name: string;
  image?: string;
  img?: string;
}

interface ProgressGalleryProps {
  amenities?: AmenityItem[];
  projectImage?: string;
  projectName?: string;
}

const GALLERY_SLOTS = [
  {
    defaultTitle: "Mosque",
    defaultImage: "/image/progress/Mosque.png",
    w: 200,
    h: 247,
  },
  {
    defaultTitle: "Mosque",
    defaultImage: "/image/progress/Mosque.png",
    w: 260,
    h: 322,
  },
  {
    defaultTitle: "Fitness Gym",
    defaultImage: "/image/progress/Gym.png",
    w: 300,
    h: 371,
  },
  {
    defaultTitle: "Lobby",
    defaultImage: "/image/progress/Lobby.png",
    w: 400,
    h: 495,
  },
  {
    defaultTitle: "Parking",
    defaultImage: "/image/progress/parking.png",
    w: 300,
    h: 371,
  },
  {
    defaultTitle: "Playground",
    defaultImage: "/image/progress/playground.png",
    w: 260,
    h: 322,
  },
  {
    defaultTitle: "Park",
    defaultImage: "/image/progress/playground.png",
    w: 200,
    h: 247,
  },
];

export function ProgressGallery({
  amenities = [],
  projectImage,
  projectName = "Project",
}: ProgressGalleryProps) {
  const [activeModalImage, setActiveModalImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const galleryItems = React.useMemo(() => {
    return GALLERY_SLOTS.map((slot, idx) => {
      const amenity =
        amenities.length > 0 ? amenities[idx % amenities.length] : undefined;
      const apiImg = amenity?.image || amenity?.img || "";
      return {
        id: `${slot.defaultTitle}-${idx}`,
        title: amenity?.name || slot.defaultTitle,
        image: apiImg || slot.defaultImage || projectImage || "/image/progress/Lobby.png",
        w: slot.w,
        h: slot.h,
      };
    });
  }, [amenities, projectImage]);

  return (
    <section
      aria-label="Project Gallery Section"
      className="relative w-full overflow-hidden bg-[#054b3c] py-[clamp(64px,6.25vw,100px)] text-white"
    >
      <div className="shell">
        {/* Centered Section Header (Figma 8036:25218) */}
        <div className="mx-auto mb-12 flex max-w-[714px] flex-col items-center gap-[16px] text-center sm:mb-[80px]">
          <Eyebrow className="text-[#cfa564]">gallery</Eyebrow>
          <Heading
            size={64}
            min={36}
            leading={1.1}
            mask
            className="text-white"
          >
            Project Gallery
          </Heading>
        </div>
      </div>

      {/* Full-bleed Staggered 7-Slot Gallery Strip (Figma 8036:25221, 2112px wide) */}
      <div className="mx-auto flex w-full max-w-[2112px] items-center justify-center gap-3 px-2 sm:gap-5 lg:gap-[32px]">
        {galleryItems.map((item, idx) => {
          const hideOnMobile = idx === 0 || idx === galleryItems.length - 1;
          return (
            <figure
              key={item.id}
              style={{ flex: `${item.w} 1 0%` }}
              className={`group min-w-0 cursor-pointer flex-col items-center ${
                hideOnMobile ? "hidden xl:flex" : "flex"
              }`}
              onClick={() =>
                setActiveModalImage({ src: item.image, title: item.title })
              }
            >
              <Shutter
                tone="bg-[#054b3c]"
                delay={0.07 * idx}
                className="relative w-full bg-[#09221c]"
              >
                <div
                  className="zoom-frame relative w-full"
                  style={{ aspectRatio: `${item.w} / ${item.h}` }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 18vw, 24vw"
                    className="object-cover object-center"
                  />

                  {/* Hover Expand Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#054b3c] shadow-md backdrop-blur-xs">
                      <Expand className="size-4" />
                    </div>
                  </div>
                </div>
              </Shutter>

              <Appear
                as="p"
                preset="lift"
                delay={0.14 + idx * 0.06}
                className="trim mt-[16px] text-center font-display text-[14px] font-medium capitalize leading-[1.5] text-white sm:text-[20px]"
              >
                {item.title}
              </Appear>
            </figure>
          );
        })}
      </div>

      {/* Lightbox Modal */}
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
              src={activeModalImage.src}
              alt={`${projectName} - ${activeModalImage.title}`}
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setActiveModalImage(null)}
              aria-label="Close image preview"
              className="absolute right-4 top-4 cursor-pointer rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
