import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectsHero } from "@/components/section/projects/projects_hero";
import { FeaturedProjectsSection } from "@/components/section/projects/featured_projects_section";
import { FeaturedProjects } from "@/components/section/home/featured_projects";
import { PropertyPredictionSection } from "@/components/section/team/property_prediction_section";
import { ResidentReviews } from "@/components/section/home/resident_reviews";

export const metadata: Metadata = {
  title: "Exclusive Properties & Projects | Premium Homes",
  description:
    "Explore exclusive luxury residences and prime architectural developments by Premium Homes.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <ProjectsHero />
        <FeaturedProjectsSection />
        <FeaturedProjects/>
        <ResidentReviews />
        <PropertyPredictionSection/>
      </main>
      <Footer />
    </div>
  );
}
