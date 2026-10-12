"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FAQHero() {
  return (
    <section
      aria-label="FAQ Hero Section"
      className="relative w-full bg-[#061d16] bg-[radial-gradient(ellipse_100%_80%_at_50%_25%,#092e24_0%,#061d16_65%,#03130f_100%)] text-white overflow-hidden"
    >
      {/* Background Ambience Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(208, 166, 91, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-36 pb-20 sm:pb-28 md:pb-36 lg:pb-40 flex flex-col justify-between min-h-[400px] sm:min-h-[480px] md:min-h-[500px]">

        {/* Center Typography */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 sm:mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-2"
          >
            {/* Breadcrumb / Eyebrow Label */}
            <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-4 sm:mb-6">
              HOMEPAGE / FAQ
            </span>

            {/* Display Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-normal text-white leading-[1.08] sm:leading-[1.04] tracking-tight">
              Frequently Asked
              <br />
              Questions
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-base text-white/75 font-normal leading-relaxed max-w-xl mx-auto mt-5 sm:mt-7">
              Find answers to common questions about Premium Homes Ltd.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
