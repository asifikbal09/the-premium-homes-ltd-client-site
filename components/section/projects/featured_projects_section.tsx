import React from "react";
import { getProjects } from "@/lib/projects";
import { ProjectsFilterGrid } from "./projects_filter_grid";

/**
 * Main Featured Projects Section (Server Component)
 * Loads project data from the central API point on the server,
 * renders the section header, and hydrates the client filterable grid.
 */
export async function FeaturedProjectsSection() {
  const projects = await getProjects();

  return (
    <section
      id="featured-projects"
      aria-label="Featured Projects"
      className="w-full bg-white py-14 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <span className="inline-block text-[#C49C57] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase">
            FEATURED PROJECT
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-normal text-[#044133] mt-2 tracking-tight">
            Featured Project
          </h2>
        </div>

        {/* Client Interactive Filter & 3-Column Grid */}
        <ProjectsFilterGrid initialProjects={projects} />
      </div>
    </section>
  );
}
