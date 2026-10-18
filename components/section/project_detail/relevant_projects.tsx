"use client";

import React, { useState } from "react";
import type { ProjectData } from "@/lib/projects";
import { ProjectCard } from "@/components/section/projects/project_card";

interface RelevantProjectsProps {
  currentProjectId: number;
  priceRange?: string;
  allProjects: ProjectData[];
}

const MAX_CARDS = 4;
const groupOf = (p: ProjectData) => p.community?.name || p.location || "";

export function RelevantProjects({
  currentProjectId,
  priceRange,
  allProjects,
}: RelevantProjectsProps) {
  const [active, setActive] = useState("ALL");

  // Same price range as the current project (price_range is a fixed label from ERP)
  const relevant = allProjects.filter(
    (p) => p.id !== currentProjectId && p.price_range === priceRange,
  );

  if (relevant.length === 0) {
    return null;
  }

  const groups = Array.from(new Set(relevant.map(groupOf).filter(Boolean)));
  const shown = relevant
    .filter((p) => active === "ALL" || groupOf(p) === active)
    .slice(0, MAX_CARDS);

  return (
    <section
      aria-label="Relevant Projects"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-[#ede7dc]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] tracking-tight text-center mb-8 sm:mb-10">
          Relevant Project
        </h2>

        {/* Community Filter Pills (only when there is something to filter) */}
        {groups.length > 1 && (
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14">
            {["ALL", ...groups].map((g) => {
              const isActive = active === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActive(g)}
                  aria-pressed={isActive}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#044133] text-white border border-[#044133]"
                      : "bg-white text-[#526058] border border-[#E3DFD7] hover:border-[#044133] hover:text-[#044133]"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {shown.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
