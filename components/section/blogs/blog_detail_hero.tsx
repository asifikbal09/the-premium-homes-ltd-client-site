"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogDetailHeroProps {
  title: string;
  category?: string | null;
}

export function BlogDetailHero({ title, category }: BlogDetailHeroProps) {
  const categoryLabel = category
    ? `${category.trim().toUpperCase()}/DETAILS`
    : "NEWS/DETAILS";

  return (
    <section
      aria-label="Blog Details Hero Section"
      className="relative w-full bg-[#061d16] bg-[radial-gradient(ellipse_100%_80%_at_50%_25%,#092e24_0%,#061d16_65%,#03130f_100%)] text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(208, 166, 91, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 md:pb-28 flex flex-col justify-between min-h-[360px] sm:min-h-[400px] md:min-h-[440px]">

        <div className="text-center mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto px-4">
          <p className="text-[#C49C57] font-semibold text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-4 sm:mb-5">
            {categoryLabel}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-white leading-[1.15] tracking-tight">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
