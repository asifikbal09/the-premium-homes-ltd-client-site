"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LifeImageItem {
  id: string;
  src: string;
  alt: string;
  type: "corner" | "side" | "center";
}

const LIFE_IMAGES: LifeImageItem[] = [
  {
    id: "life-1",
    src: "/image/career/career01.png",
    alt: "Outdoor company gathering",
    type: "corner",
  },
  {
    id: "life-2",
    src: "/image/career/career03.png",
    alt: "Executive discussions and signing",
    type: "side",
  },
  {
    id: "life-3",
    src: "/image/career/career05.png",
    alt: "Premium Homes leadership at BYD event",
    type: "center",
  },
  {
    id: "life-4",
    src: "/image/career/career04.png",
    alt: "Team members at development site",
    type: "side",
  },
  {
    id: "life-5",
    src: "/image/career/career02.png",
    alt: "Team celebration and gifting",
    type: "corner",
  },
];

export function CareerLife() {
  return (
    <section
      aria-label="Life At Premium Homes"
      className="relative w-full bg-[#48564f] text-white py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden"
    >
      {/* Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-14 md:mb-16">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block text-[#d0a65b] font-semibold text-xs sm:text-[13px] tracking-[0.24em] uppercase mb-3 sm:mb-4"
        >
          LIFE AT PREMIUM HOMES
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] font-normal text-white leading-[1.08] tracking-tight"
        >
          A Glimpse Into Life At
          <br />
          Premium Homes
        </motion.h2>
      </div>

      {/* Full-width Image Showcase Row */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div className="w-full overflow-x-auto pb-6 pt-2 scrollbar-none">
          <div className="flex items-center justify-start lg:justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6 min-w-max lg:min-w-0 w-full mx-auto">
            {LIFE_IMAGES.map((img, index) => {
              const isCenter = img.type === "center";
              const isSide = img.type === "side";

              const cardClasses = isCenter
                ? "lg:flex-[1.6] w-[270px] sm:w-[320px] md:w-[360px] lg:w-auto h-[380px] sm:h-[480px] md:h-[540px] lg:h-[620px] xl:h-[670px] 2xl:h-[700px] z-20 shadow-2xl ring-1 ring-white/20"
                : isSide
                ? "lg:flex-[1.25] w-[220px] sm:w-[270px] md:w-[300px] lg:w-auto h-[320px] sm:h-[400px] md:h-[460px] lg:h-[530px] xl:h-[570px] 2xl:h-[600px] z-10 shadow-xl opacity-95 hover:opacity-100 ring-1 ring-white/10"
                : "lg:flex-[1] w-[190px] sm:w-[230px] md:w-[250px] lg:w-auto h-[260px] sm:h-[330px] md:h-[390px] lg:h-[450px] xl:h-[480px] 2xl:h-[510px] z-0 shadow-lg opacity-90 hover:opacity-100 ring-1 ring-white/10";

              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.94, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.6,
                    delay: Math.abs(index - 2) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    scale: 1.025,
                    y: -4,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className={`group relative shrink-0 overflow-hidden rounded-none bg-neutral-900/60 transition-all duration-300 hover:ring-2 hover:ring-[#d0a65b] ${cardClasses}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={isCenter}
                    sizes={
                      isCenter
                        ? "(max-width: 640px) 270px, (max-width: 1024px) 360px, (max-width: 1536px) 28vw, 480px"
                        : isSide
                        ? "(max-width: 640px) 220px, (max-width: 1024px) 300px, (max-width: 1536px) 22vw, 380px"
                        : "(max-width: 640px) 190px, (max-width: 1024px) 250px, (max-width: 1536px) 18vw, 320px"
                    }
                    className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
