"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function LifeAtTphlPurpose() {
  return (
    <section
      aria-label="Built By People, Driven By Purpose"
      className="relative w-full bg-white text-[#1f2723] pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-16 sm:pb-24 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Top Grid: Headline on the left, Two staggered images on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 items-start">
          {/* Left Column: Display Heading */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            <h2 className="font-heading font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] text-[#054b3c] leading-[1.04] sm:leading-[1.02] tracking-tight">
              Built By
              <br />
              People.
              <br />
              Driven By
              <br />
              Purpose.
            </h2>
          </div>

          {/* Right Column: Two Photos aligned at the bottom baseline */}
          <div className="lg:col-span-7 flex items-end gap-5 sm:gap-6 md:gap-8">
            {/* Primary Image: tplt-team05.png (Taller Portrait) */}
            <div className="relative w-[60%] sm:w-[58%] aspect-[3/4] overflow-hidden bg-neutral-100 shadow-sm">
              <Image
                src="/image/life-at-tphl/tplt-team05.png"
                alt="TPHL architect reviewing community master plan"
                fill
                sizes="(max-width: 768px) 60vw, 420px"
                className="object-cover object-top hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Secondary Image: vedioImage.png (Smaller Portrait, sharing bottom baseline) */}
            <div className="relative w-[38%] sm:w-[36%] aspect-[3/4] overflow-hidden bg-neutral-100 shadow-sm">
              <Image
                src="/image/life-at-tphl/vedioImage.png"
                alt="TPHL relationship manager showcasing home interior to client"
                fill
                sizes="(max-width: 768px) 38vw, 260px"
                className="object-cover object-center hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* 
          Middle Decorative Watermark:
          "purpose" fluidly spanning across the container width without any clipping
        */}
        <div className="relative w-full overflow-visible text-center select-none pointer-events-none -my-3 sm:-my-6 md:-my-10 lg:-my-14">
          <p
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-victor), 'K Victor Trial', serif",
              fontWeight: 100,
              fontStyle: "normal",
              lineHeight: "100%",
              letterSpacing: "0%",
              textTransform: "lowercase",
            }}
            className="w-full mb-20 text-[#dbe3e1] text-[clamp(68px,18.5vw,350px)] whitespace-nowrap select-none"
          >
            purpose
          </p>
        </div>

        {/* Bottom Content: Aligned with the right content column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 pt-2 sm:pt-4">
          {/* Spacer matching left column width */}
          <div className="hidden lg:block lg:col-span-5" />

          {/* Right Column: Paragraph and CTA button aligned directly under images */}
          <div className="lg:col-span-7 flex flex-col items-start max-w-xl">
            <p className="font-sans text-xs sm:text-sm md:text-[14.5px] text-[#526058] font-normal leading-relaxed mb-6 sm:mb-8">
              At TPHL, Every Project Begins With People. From Our Sales Teams To
              Project Managers, Engineers, Designers, And Support Teams, We Work
              Together To Build Homes, Trust, And Long-Term Value For Families
              Across Bangladesh.
            </p>

            <Link
              href="/career"
              className="group inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-[#054b3c] hover:bg-[#075947] transition-all duration-300 shadow-sm active:scale-95"
            >
              <span>JOIN OUR TEAM</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
