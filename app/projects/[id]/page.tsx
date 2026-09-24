import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById, getProjects } from "@/lib/projects";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectHero } from "@/components/section/project_detail/project_hero";
import { ProjectOverviewSection } from "@/components/section/project_detail/project_overview_section";
import { UnitTypeSelector } from "@/components/section/project_detail/unit_type_selector";
import { SpecificationSection } from "@/components/section/project_detail/specification_section";
import { SneakPeekGallery } from "@/components/section/project_detail/sneak_peek_gallery";
import { AroundTheHome } from "@/components/section/project_detail/around_the_home";
import { RelevantProjects } from "@/components/section/project_detail/relevant_projects";
import { ArtOfLivingVideo } from "@/components/section/home/art_of_living_video";
import { ProjectContactSection } from "@/components/section/project_detail/project_contact_section";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return {
      title: "Project Not Found | Premium Homes",
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${project.name} | Exclusive Real Estate by Premium Homes`,
    description:
      project.description?.slice(0, 160) ||
      `Explore luxury living at ${project.name}, located in ${project.location}.`,
  };
}

/**
 * Server Component: Loads project data from the central API point on the server.
 * Uses Next.js App Router dynamic route projects/{id}.
 */
export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  // Load all projects for the "Relevant Project" section
  const allProjects = await getProjects();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1f2723]">
      {/* Floating Navigation Header on Scroll */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* Section 1: Hero Section */}
        <ProjectHero
          name={project.name}
          image={project.images[0] || project.image}
          tag={project.tag}
          location={project.location}
        />

        {/* Section 2: Project Overview */}
        <ProjectOverviewSection project={project} />

        {/* Section 3: Choose Unit Type */}
        <UnitTypeSelector units={project.units} projectName={project.name} />

        {/* Section 4: Specification */}
        <SpecificationSection project={project} />

        {/* Section 5: Sneak Peek From Your Future Home */}
        <SneakPeekGallery images={project.images} projectName={project.name} />

        {/* Section 6: See What's Around The Home */}
        <AroundTheHome project={project} />

        {/* Section 7: Relevant Project */}
        <RelevantProjects
          currentProjectId={project.id}
          allProjects={allProjects}
        />

        {/* Section 8: More Than Building, A Way Of Living */}
        <ArtOfLivingVideo />

        {/* Section 9: Get In Touch (Let's Talk) */}
        <ProjectContactSection projectName={project.name} />
      </main>

      {/* Section 10: Footer */}
      <Footer />
    </div>
  );
}
