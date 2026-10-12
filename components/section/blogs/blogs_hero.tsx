"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BlogsHero() {
  return (
    <section
      aria-label="Blogs Hero Section"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 md:pb-28 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] md:min-h-[460px]">

        {/* Hero Title & Subtitle */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20 max-w-3xl mx-auto px-4">
          <p className="text-[#C49C57] font-semibold text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-3">
            HOMEPAGE / NEWS
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal text-white leading-[1.1] tracking-tight">
            Blogs, Insights
          </h1>
          <p className="text-white/70 text-xs sm:text-sm md:text-[15px] font-normal max-w-xl mx-auto mt-4 leading-relaxed">
            Our Philosophy is simple, hire great people and give them the
            resources and support to do their best work
          </p>
        </div>
      </div>
    </section>
  );
}
