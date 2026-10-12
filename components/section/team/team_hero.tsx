"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TeamHero() {
  return (
    <section
      aria-label="Team Hero Section"
      className="relative w-full bg-[#051c16] bg-[radial-gradient(ellipse_100%_80%_at_50%_25%,#092e24_0%,#051c16_65%,#03130f_100%)] text-white overflow-hidden"
    >
      {/* Background Ambience Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(208, 166, 91, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-36 pb-20 sm:pb-28 md:pb-36 lg:pb-40 flex flex-col justify-between min-h-[520px] sm:min-h-[580px] md:min-h-[640px]">

        {/* Center Typography matching Image 1 */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 sm:mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-2"
          >
            {/* Eyebrow Label */}
            <span className="inline-block text-[#d0a65b] font-semibold text-xs sm:text-[13px] md:text-sm tracking-[0.22em] uppercase mb-4 sm:mb-6">
              MEET THE TEAM
            </span>

            {/* Display Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-normal text-white leading-[1.08] sm:leading-[1.04] tracking-tight">
              The People Behind
              <br />
              Every Premium Home.
            </h1>

            {/* Philosophy Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-base lg:text-lg text-white/75 font-normal leading-relaxed max-w-xl mx-auto mt-5 sm:mt-7">
              Our Philosophy is simple, hire great people and give them the
              resources and support to do their best work
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
