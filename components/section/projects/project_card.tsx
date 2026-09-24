"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ruler, Bath, Columns } from "lucide-react";
import type { ProjectData } from "@/lib/projects";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(project.image);

  // Formatted SQFT
  const sqft = project.size
    ? project.size.toUpperCase().replace(/\s*SQFT|\s*SFT/i, "") + " SQFT"
    : "1600 SQFT";

  // Beds / Bathrooms / Balconies
  const bathsCount = project.beds || 3;
  const balconiesCount = project.beds || 3;

  return (
    <article className="group flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300">
      {/* Card Image Container */}
      <Link
        href={`/projects/${project.id}`}
        className="relative block w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f3efe9]"
      >
        {/* Luxury Collection Badge */}
        <div className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-10">
          <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase text-white bg-black/45 backdrop-blur-md border border-white/20 shadow-xs">
            {project.tag || "LUXURY COLLECTION"}
          </span>
        </div>

        {/* Project Thumbnail Image */}
        <Image
          src={imgSrc}
          alt={project.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/image/projects/projectsHero.png")}
        />
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 pt-4 pb-1 px-1">
        {/* Top Info Row: Title & Subtitle on Left, Starting from & Price on Right */}
        <div className="flex items-start justify-between gap-3 min-h-[56px]">
          {/* Left: Name and Location / Description */}
          <div className="flex-1 min-w-0">
            <Link href={`/projects/${project.id}`} className="block">
              <h3 className="font-heading text-xl sm:text-2xl font-medium text-[#14261f] group-hover:text-[#044133] transition-colors leading-snug truncate">
                {project.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 font-light mt-1 line-clamp-2 leading-relaxed">
              {project.description ||
                `${project.location} — designed for modern living`}
            </p>
          </div>

          {/* Right: Starting From & Price */}
          <div className="text-right shrink-0">
            <span className="block text-[10px] sm:text-[11px] text-gray-400 font-medium tracking-wider uppercase">
              Starting from
            </span>
            <span className="block text-xs sm:text-[13px] font-bold text-[#14261f] mt-0.5 whitespace-nowrap">
              {project.price_range || project.price || "Contact for Price"}
            </span>
          </div>
        </div>

        {/* Divider & Specs Footer */}
        <div className="border-t border-[#ede7dc] mt-4 pt-3 flex items-center justify-between gap-2">
          {/* Left: Specs (SQFT, Bathroom, Balcony) */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-tight">
            {/* SQFT */}
            <div className="flex items-center gap-1 shrink-0">
              <Ruler className="w-3.5 h-3.5 text-[#044133]/70" />
              <span>{sqft}</span>
            </div>

            {/* Bathroom */}
            <div className="flex items-center gap-1 shrink-0">
              <Bath className="w-3.5 h-3.5 text-[#044133]/70" />
              <span>{bathsCount} BATH</span>
            </div>

            {/* Balcony */}
            <div className="flex items-center gap-1 shrink-0">
              <Columns className="w-3.5 h-3.5 text-[#044133]/70" />
              <span>{balconiesCount} BALCONY</span>
            </div>
          </div>

          {/* Right: DETAILS button */}
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 rounded-full border border-[#044133]/35 text-[#044133] hover:bg-[#044133] hover:text-white transition-all duration-200 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap active:scale-95 cursor-pointer shadow-2xs"
          >
            DETAILS
          </Link>
        </div>
      </div>
    </article>
  );
}
