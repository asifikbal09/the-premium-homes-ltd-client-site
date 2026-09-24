import React from "react";
import type { ProjectData } from "@/lib/projects";
import { ProjectCard } from "@/components/section/projects/project_card";

interface RelevantProjectsProps {
  currentProjectId: number;
  allProjects: ProjectData[];
}

export function RelevantProjects({
  currentProjectId,
  allProjects,
}: RelevantProjectsProps) {
  // Filter out the current project, take 2 relevant projects
  const relevantList = allProjects
    .filter((p) => p.id !== currentProjectId)
    .slice(0, 2);

  if (relevantList.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Relevant Projects"
      className="w-full bg-[#fbf9f5] py-16 sm:py-20 lg:py-24 border-t border-[#ede7dc]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            EXPLORE MORE
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-1.5 tracking-tight">
            Relevant Project
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-2">
            Discover other distinguished luxury developments crafted by Premium
            Homes.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {relevantList.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
