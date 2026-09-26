"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectDetail } from "@/lib/projects";

interface ProjectOverviewProps {
  project: ProjectDetail;
}

function WaterfrontIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Left Pine Tree */}
      <path d="M7 4 L9 7 H8 L10 10 H8.5 L10.5 13 H5.5 L7.5 10 H6 L8 7 H7 Z" />
      <path d="M8 13 V17" />
      {/* Center Pine Tree */}
      <path d="M15 4 L17 7 H16 L18 10 H16.5 L18.5 13 H13.5 L15.5 10 H14 L16 7 H15 Z" />
      <path d="M16 13 V17" />
      {/* Right Pine Tree */}
      <path d="M23 4 L25 7 H24 L26 10 H24.5 L26.5 13 H21.5 L23.5 10 H22 L24 7 H23 Z" />
      <path d="M24 13 V17" />
      {/* Ground line */}
      <path d="M4 17.5 H28" />
      {/* Water ripples */}
      <path d="M4 21.5 C6.5 20.5 8.5 22.5 11 21.5 C13.5 20.5 15.5 22.5 18 21.5 C20.5 20.5 22.5 22.5 25 21.5 C26.5 20.5 27.5 21 28 21.5" />
      <path d="M4 25.5 C6.5 24.5 8.5 26.5 11 25.5 C13.5 24.5 15.5 26.5 18 25.5 C20.5 24.5 22.5 26.5 25 25.5 C26.5 24.5 27.5 25 28 25.5" />
    </svg>
  );
}

function RetailIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11 9 C11 5.5 13.5 3 16 3 C18.5 3 21 5.5 21 9" />
      <path d="M6 9.5 H26" />
      <path d="M6.5 9.5 L8 27.5 C8 29 9 30 10.5 30 H21.5 C23 30 24 29 24 27.5 L25.5 9.5" />
      <circle cx="11" cy="13" r="1.2" fill="currentColor" />
      <circle cx="21" cy="13" r="1.2" fill="currentColor" />
      <rect x="12" y="18" width="8" height="6" rx="1" stroke="currentColor" />
    </svg>
  );
}

function CityIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 29 H29" />
      <path d="M4 29 V18 H10 V29" />
      <path d="M6 21 H8 M6 24 H8 M6 27 H8" />
      <path d="M10 29 V9 H20 V29" />
      <path d="M15 9 V3 M13.5 5.5 H16.5" />
      <path d="M12.5 13 H17.5 M12.5 17 H17.5 M12.5 21 H17.5 M12.5 25 H17.5" />
      <path d="M20 29 V14 H27 V29" />
      <path d="M22.5 17 H25 M22.5 21 H25 M22.5 25 H25" />
    </svg>
  );
}

function GymIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </svg>
  );
}

export function ProjectOverviewSection({ project }: ProjectOverviewProps) {
  const projectStatus =
    project.project_sale_status ||
    (project.status === "Ongoing" ? "Under Development" : project.status) ||
    "Under Development";

  const startingPrice =
    project.price_range || project.price || "80lac - 2cr BDT";

  const features = [
    {
      title: "Waterfront Setting",
      icon: <WaterfrontIcon className="w-8 h-8 text-[#044133]" />,
    },
    {
      title: "Retail & Dining Close",
      icon: <RetailIcon className="w-8 h-8 text-[#044133]" />,
    },
    {
      title: "Easy City Access",
      icon: <CityIcon className="w-8 h-8 text-[#044133]" />,
    },
    {
      title: "Lifestyle Amenities Nearby",
      icon: <GymIcon className="w-8 h-8 text-[#044133]" />,
    },
  ];

  return (
    <section
      aria-label="Project Overview"
      className="w-full bg-white py-14 sm:py-18 lg:py-22"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#ede7dc]">
          {/* Left: Project Info & Heading */}
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#c09347] block mb-1.5">
              PROJECT INFO
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] tracking-tight leading-tight">
              Project Overview
            </h2>
          </div>

          {/* Right: Status & Starting Price */}
          <div className="flex items-center gap-10 sm:gap-14 self-start sm:self-end">
            <div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.14em] uppercase text-gray-400 block mb-1">
                PROJECT STATUS
              </span>
              <span className="font-heading text-xl sm:text-2xl font-normal text-[#044133] leading-none block">
                {projectStatus}
              </span>
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.14em] uppercase text-gray-400 block mb-1">
                STARTING FROM
              </span>
              <span className="font-heading text-xl sm:text-2xl font-normal text-[#044133] leading-none block">
                {startingPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Image on Left, Narrative & Actions on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mt-8 sm:mt-10">
          {/* Left Column: Building Image */}
          <div className="lg:col-span-6 relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#f4efe8]">
            <Image
              src={
                project.images[0] ||
                project.image ||
                "/image/projects/projectsHero.png"
              }
              alt={project.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: Narrative & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="space-y-4 text-gray-600 text-sm sm:text-[15px] leading-relaxed font-light">
              <p>
                {project.name} is a premium residential project that blends
                modern architecture with luxury and comfort.
              </p>
              <p>
                Designed with spacious layouts, quality finishes, and contemporary
                amenities, it offers an elevated living experience. Its prime
                location provides convenient access to essential services,
                making it an ideal choice for families and investors alike.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#044133] hover:bg-[#055b4b] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-xs active:scale-95"
              >
                CONTACT AGENT
              </Link>

              <button
                type="button"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-[#b4aea4] hover:border-[#044133] hover:text-[#044133] text-[#4a5568] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer active:scale-95"
              >
                LOG IN TO SAVE PROPERTY
              </button>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-12 sm:mt-16">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="border border-[#e7e5e4] bg-white p-6 sm:p-7 flex flex-col justify-between min-h-[140px] sm:min-h-[150px] transition-shadow hover:shadow-xs"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-heading text-lg sm:text-xl font-normal text-[#1f2723] leading-snug">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
