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
    src: "/image/career/career02.png",
    alt: "Team celebration and gifting",
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
    src: "/image/career/career03.png",
    alt: "Executive discussions and signing",
    type: "corner",
  },
  {
    id: "life-5",
    src: "/image/career/career04.png",
    alt: "Team members at development site",
    type: "side",
  },
];

export function CareerLife() {
  return (
    <section
      aria-label="Life At Premium Homes"
      className="relative w-full bg-[#48564f] text-white py-16 sm:py-24 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-[#d0a65b] font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-3 sm:mb-4"
          >
            LIFE AT PREMIUM HOMES
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-normal text-white leading-[1.08] tracking-tight"
          >
            A Glimpse Into Life At
            <br />
            Premium Homes
          </motion.h2>
        </div>

        {/* 5-Image Horizontal Staggered Row matching Image 2 */}
        <div className="w-full overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <div className="flex items-center justify-start lg:justify-center gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 min-w-max lg:min-w-0 mx-auto">
            {LIFE_IMAGES.map((img, index) => {
              // Exact proportions:
              // center: biggest
              // side: smaller
              // corner: more smaller
              const sizeClasses =
                img.type === "center"
                  ? "w-[220px] sm:w-[280px] md:w-[330px] lg:w-[370px] xl:w-[410px] h-[320px] sm:h-[410px] md:h-[480px] lg:h-[540px] xl:h-[590px] z-20 shadow-2xl"
                  : img.type === "side"
                    ? "w-[160px] sm:w-[210px] md:w-[250px] lg:w-[280px] xl:w-[310px] h-[240px] sm:h-[310px] md:h-[370px] lg:h-[420px] xl:h-[460px] z-10 shadow-xl opacity-95 hover:opacity-100"
                    : "w-[130px] sm:w-[170px] md:w-[200px] lg:w-[230px] xl:w-[250px] h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] xl:h-[350px] z-0 shadow-lg opacity-90 hover:opacity-100";

              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.6,
                    delay: Math.abs(index - 2) * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    scale: 1.025,
                    transition: { duration: 0.25 },
                  }}
                  className={`relative shrink-0 overflow-hidden bg-neutral-800 transition-all duration-300 ${sizeClasses}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    priority={img.type === "center"}
                    sizes={
                      img.type === "center"
                        ? "(max-width: 640px) 260px, (max-width: 1024px) 370px, 420px"
                        : img.type === "side"
                          ? "(max-width: 640px) 190px, (max-width: 1024px) 270px, 310px"
                          : "(max-width: 640px) 150px, (max-width: 1024px) 210px, 250px"
                    }
                    className="object-cover object-center transform transition-transform duration-500 ease-out hover:scale-105"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
