import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectsHero } from "@/components/section/projects/projects_hero";
import { FeaturedProjectsSection } from "@/components/section/projects/featured_projects_section";
import { SignatureDevelopments } from "@/components/section/home/signature_developments";
import { HomeTestimonials } from "@/components/section/home/home_testimonials";
import { HomeCta } from "@/components/section/home/home_cta";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Exclusive Properties & Projects | Premium Homes",
  description:
    "Explore exclusive luxury residences and prime architectural developments by Premium Homes.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <ProjectsHero />
        <FeaturedProjectsSection projects={projects} />
        <SignatureDevelopments initialProjects={projects} />
        <HomeTestimonials />
        <HomeCta />
      </main>
      <Footer reveal />
    </div>
  );
}
