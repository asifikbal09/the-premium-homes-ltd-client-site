"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, Bath, Columns, MapPin } from "lucide-react";
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
  const projectHref = `/projects/${project.slug || project.id}`;
  const location = project.location || project.community?.name;

  return (
    <article className="group flex flex-col bg-white">
      {/* Card Image (whole area links to details) */}
      <Link
        href={projectHref}
        aria-label={`View details of ${project.name}`}
        className="relative block w-full aspect-[4/3] overflow-hidden bg-[#f3efe9]"
      >
        <Image
          src={imgSrc}
          alt={project.name}
          fill
          // ponytail: source is a 1600x600 banner cropped to 4:3, so only ~half its width
          // is visible; request ~2x the card width. Revert to normal sizes once ERP has proper card images.
          sizes="(max-width: 768px) 200vw, 100vw"
          quality={90}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/image/projects/projectsHero.png")}
        />

        {/* Luxury Collection Badge */}
        <span className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-10 inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase text-white bg-black/45 backdrop-blur-md border border-white/20">
          {project.tag || "LUXURY COLLECTION"}
        </span>

        {/* Circular PROJECT DETAILS badge, revealed on hover */}
        <span className="absolute bottom-5 right-5 z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-center text-white text-[10px] sm:text-[11px] font-normal tracking-widest uppercase leading-tight opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
          Project
          <br />
          Details
        </span>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 pt-4">
        {/* Title & Description on Left, Starting from & Price on Right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={projectHref} className="block">
              <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] leading-snug truncate">
                {project.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 font-light mt-1 line-clamp-2 leading-relaxed max-w-sm">
              {project.description ||
                `${project.location} — designed for modern living`}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="block text-[11px] text-gray-400 font-light">
              Starting from
            </span>
            <span className="block text-sm sm:text-base font-normal text-[#14261f] mt-0.5 whitespace-nowrap">
              {project.price_range || project.price || "Contact for Price"}
            </span>
          </div>
        </div>

        {/* Specs Row */}
        <div className="border-t border-[#ede7dc] mt-4 pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide text-gray-700">
          <span className="inline-flex items-center gap-1.5">
            <Home className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            {sqft}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            {bathsCount} BATHROOM
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Columns className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            {balconiesCount} BALCONY
          </span>
        </div>

        {/* Location Row */}
        {location && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin className="w-4 h-4 text-gray-500 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{location}</span>
          </p>
        )}
      </div>
    </article>
  );
}
