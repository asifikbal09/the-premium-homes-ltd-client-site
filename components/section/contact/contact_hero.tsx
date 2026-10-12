"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ContactHero() {
  return (
    <section
      aria-label="Contact Us Hero Section"
      className="relative w-full bg-[#061d16] bg-[radial-gradient(ellipse_100%_80%_at_50%_25%,#092e24_0%,#061d16_65%,#03130f_100%)] text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(208, 166, 91, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-36 pb-20 sm:pb-28 md:pb-32 flex flex-col justify-between min-h-[380px] sm:min-h-[440px] md:min-h-[460px]">

        <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 sm:mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-2"
          >
            <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-4 sm:mb-6">
              HOMEPAGE / CONTACT US
            </span>

            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-white leading-[1.08] tracking-tight">
              Contact Us
            </h1>

            <p className="font-sans text-xs sm:text-sm md:text-base text-white/75 font-normal leading-relaxed max-w-xl mx-auto mt-4 sm:mt-6">
              We&apos;re here to help you find your dream home. Reach out to us anytime!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
