"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressDetailsHeroProps {
  projectName: string;
  location: string;
  tagline?: string;
  progressPercentage?: number;
  expectedHandover?: string;
  status?: string;
}

export function ProgressDetailsHero({
  projectName,
  location,
  tagline,
  progressPercentage = 0,
  expectedHandover,
  status = "ONGOING PROJECT",
}: ProgressDetailsHeroProps) {
  // SVG Circular Gauge calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const safePct = Math.min(100, Math.max(0, progressPercentage));
  const strokeDashoffset = circumference - (safePct / 100) * circumference;

  return (
    <section
      aria-label="Project Progress Details Hero"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-24 flex flex-col justify-between min-h-[420px] sm:min-h-[460px]">

        {/* Hero Main Content */}
        <div className="flex-1 flex flex-col justify-center mt-12 sm:mt-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="max-w-2xl">
              <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-3 sm:mb-4">
                {status}
              </span>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal text-white leading-[1.08] tracking-tight">
                {projectName}
              </h1>

              {tagline && (
                <p className="font-sans text-sm sm:text-base text-white/80 font-light mt-3 sm:mt-4 leading-relaxed">
                  {tagline}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 mt-4 sm:mt-5">
                <MapPin className="h-4 w-4 text-[#d0a65b] shrink-0" />
                <span>{location}</span>
              </div>
            </div>

            {/* Right Stat Cards */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
              {/* Construction Complete Card */}
              <div className="flex-1 sm:flex-initial min-w-[210px] flex items-center gap-4 px-5 py-4 rounded-xl bg-[#0c2620]/80 backdrop-blur-md border border-white/10 shadow-lg">
                {/* Circular Gauge */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
                    <circle
                      cx="26"
                      cy="26"
                      r={radius}
                      className="stroke-white/15 fill-none"
                      strokeWidth="4"
                    />
                    <circle
                      cx="26"
                      cy="26"
                      r={radius}
                      className="stroke-[#d0a65b] fill-none transition-all duration-1000 ease-out"
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <span className="font-heading text-2xl sm:text-3xl text-white font-normal leading-none block">
                    {progressPercentage}%
                  </span>
                  <span className="text-[11px] sm:text-xs text-white/60 font-sans tracking-wide block mt-1">
                    Construction Complete
                  </span>
                </div>
              </div>

              {/* Expected Handover Card */}
              <div className="flex-1 sm:flex-initial min-w-[210px] flex items-center gap-4 px-5 py-4 rounded-xl bg-[#0c2620]/80 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-6 w-6 text-[#d0a65b]" />
                </div>

                <div>
                  <span className="font-heading text-2xl sm:text-3xl text-white font-normal leading-none block">
                    {expectedHandover}
                  </span>
                  <span className="text-[11px] sm:text-xs text-white/60 font-sans tracking-wide block mt-1">
                    Expected Handover
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
