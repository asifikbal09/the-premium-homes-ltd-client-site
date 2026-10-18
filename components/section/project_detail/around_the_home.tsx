"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProjectDetail } from "@/lib/projects";

interface AroundTheHomeProps {
  project: ProjectDetail;
}

export function AroundTheHome({ project }: AroundTheHomeProps) {
  // ponytail: tab only highlights for now; will filter map pins once the map is dynamic.
  const [activeIdx, setActiveIdx] = useState(0);
  const amenities = project.amenities || [];

  return (
    <section
      aria-label="Nearby Locations"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            NEARBY LOCATIONS
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-normal text-[#044133] mt-2 tracking-tight leading-tight">
            See What&apos;s Around <br className="hidden sm:inline" />
            The Home
          </h2>
        </div>

        {/* Map: project.map_image only; empty box if missing */}
        <div className="relative w-full aspect-[663/295] bg-[#f4f2ee] overflow-hidden">
          {project.map_image && (
            <Image
              src={project.map_image}
              alt={`${project.name} Location Map`}
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          )}
        </div>

        {/* Dynamic amenity tabs */}
        {amenities.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-none md:grid-flow-col md:auto-cols-fr">
            {amenities.map((a, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-pressed={active}
                  className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border text-left transition-colors cursor-pointer ${
                    active
                      ? "bg-[#044133] border-[#044133] text-white"
                      : "bg-white border-[#ede7dc] text-[#14261f] hover:border-[#044133]/40"
                  }`}
                >
                  {a.image && (
                    <span className="relative w-6 h-6 shrink-0">
                      <Image
                        src={a.image}
                        alt=""
                        fill
                        sizes="24px"
                        className={`object-contain ${active ? "brightness-0 invert" : ""}`}
                      />
                    </span>
                  )}
                  <span className="font-heading text-sm sm:text-base font-normal leading-snug">
                    {a.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
