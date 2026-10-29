import { Suspense } from "react";
import { Eyebrow, Heading } from "@/components/ui/primitives";
import type { ProjectData } from "@/lib/projects";
import { ProjectsFilterGrid } from "./projects_filter_grid";

/** Figma "Featured Project": section header over the filterable grid of every project from the API. */
export function FeaturedProjectsSection({ projects }: { projects: ProjectData[] }) {
  return (
    <section
      id="featured-projects"
      aria-label="Featured projects"
      className="bg-white pb-12 pt-16 md:pt-[120px]"
    >
      <div className="shell">
        <div className="flex max-w-[835px] flex-col gap-4">
          <Eyebrow>Featured Project</Eyebrow>
          <Heading size={64} min={40} leading={1.1} mask>
            Featured Project
          </Heading>
        </div>
        <div className="mt-10 md:mt-12">
          {/* useSearchParams needs a Suspense boundary on a statically rendered page. */}
          <Suspense>
            <ProjectsFilterGrid initialProjects={projects} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
