"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ruler, Bed, MapPin, Sparkles, Download, FileText } from "lucide-react";
import type { ProjectDetail } from "@/lib/projects";

interface ProjectOverviewProps {
  project: ProjectDetail;
}

export function ProjectOverviewSection({ project }: ProjectOverviewProps) {
  const [activeTab, setActiveTab] = useState<string>(
    project.types || "Residential Suites",
  );

  const formattedSqft = project.size
    ? project.size.toUpperCase().replace(/\s*SQFT|\s*SFT/i, "") + " Sqft"
    : "2,450 Sqft";
  const bedsCount = project.beds ? `${project.beds} Beds` : "3-4 Beds";

  return (
    <section
      aria-label="Project Overview"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-12 border-b border-[#ede7dc] pb-5">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] tracking-tight">
              Project Overview
            </h2>
          </div>

          {/* Right Sub-Tabs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
            <button
              type="button"
              onClick={() =>
                setActiveTab(project.types || "Residential Suites")
              }
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === (project.types || "Residential Suites")
                  ? "bg-[#044133] text-white shadow-xs"
                  : "text-gray-500 hover:text-[#044133]"
              }`}
            >
              {project.types || "Residential Suites"}
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setActiveTab("Luxury Collection")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === "Luxury Collection"
                  ? "bg-[#044133] text-white shadow-xs"
                  : "text-gray-500 hover:text-[#044133]"
              }`}
            >
              Luxury Collection
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Image on Left, Content on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Portrait Building Image with Status Badge */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] max-h-[540px] rounded-3xl overflow-hidden bg-[#f4efe8] shadow-lg border border-[#ede7dc]">
            <Image
              src={
                project.images[0] ||
                project.image ||
                "/image/projects/projectsHero.png"
              }
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />

            {/* Status Pill Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[#044133]/90 backdrop-blur-md shadow-md">
                {project.project_sale_status || project.status || "Ongoing"}
              </span>
            </div>
          </div>

          {/* Right Column: Title, Subtitle, Narrative, CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
                THE EXPERIENCE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-normal text-[#14261f] mt-1 tracking-tight">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 font-light mt-1">
                {project.location}
              </p>
            </div>

            <div className="text-gray-600 text-sm sm:text-base leading-relaxed font-light space-y-3">
              <p>{project.description}</p>
              <p>
                Every element reflects meticulous craftsmanship, intelligent
                spatial planning, and timeless modern aesthetics, offering
                residents an unparalleled standard of urban prestige.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {project.brochure_link ? (
                <a
                  href={project.brochure_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#044133] hover:bg-[#055b4b] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4 text-[#d0a65b]" />
                  <span>Download Brochure</span>
                </a>
              ) : (
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#044133] hover:bg-[#055b4b] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md active:scale-95"
                >
                  <FileText className="w-4 h-4 text-[#d0a65b]" />
                  <span>Request Full Details</span>
                </Link>
              )}

              <Link
                href="#contact"
                className="inline-flex items-center px-6 sm:px-7 py-3 rounded-full border border-[#044133]/30 text-[#044133] hover:bg-[#044133]/5 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Key Metrics Bar Underneath with Hairline Dividers */}
        <div className="mt-14 sm:mt-18 border-y border-[#ede7dc] py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Metric 1: Size */}
          <div className="flex items-center gap-3 md:border-r border-[#ede7dc] pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
              <Ruler className="w-5 h-5 text-[#d0a65b]" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Approx. Size
              </span>
              <span className="font-semibold text-sm sm:text-base text-[#14261f]">
                {formattedSqft}
              </span>
            </div>
          </div>

          {/* Metric 2: Bedrooms */}
          <div className="flex items-center gap-3 md:border-r border-[#ede7dc] pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
              <Bed className="w-5 h-5 text-[#d0a65b]" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Bedrooms
              </span>
              <span className="font-semibold text-sm sm:text-base text-[#14261f]">
                {bedsCount}
              </span>
            </div>
          </div>

          {/* Metric 3: Location */}
          <div className="flex items-center gap-3 md:border-r border-[#ede7dc] pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#d0a65b]" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Prime Location
              </span>
              <span className="font-semibold text-sm sm:text-base text-[#14261f] truncate block max-w-[160px]">
                {project.location || "Bashundhara R/A"}
              </span>
            </div>
          </div>

          {/* Metric 4: Price */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#d0a65b]" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Price Starting
              </span>
              <span className="font-semibold text-sm sm:text-base text-[#14261f] truncate block max-w-[160px]">
                {project.price_range || project.price || "Contact Desk"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
