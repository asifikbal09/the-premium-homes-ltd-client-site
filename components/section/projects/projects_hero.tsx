"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProjectsHero() {
  return (
    <section
      aria-label="Projects Hero Section"
      className="relative w-full bg-[#031310] overflow-hidden"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/image/projects/projectsHero.png"
          alt="Exclusive Properties In Prime Locations"
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-center transform scale-100"
        />

        {/* Soft Linear Gradient Overlay for text contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(3, 19, 16, 0.45) 0%, rgba(3, 19, 16, 0.1) 40%, rgba(3, 19, 16, 0.4) 100%)",
          }}
        />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-24 md:pb-32 lg:pb-36 flex flex-col justify-end min-h-[460px] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[660px]">

        {/* Hero Title Matching Design */}
        <div className="relative z-20 w-full mt-16 sm:mt-24 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-normal text-white leading-[1.06] tracking-tight drop-shadow-md select-none">
              Exclusive Properties
              <br />
              In Prime Locations
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
