import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectProgressHero } from "@/components/section/project_progress/project_progress_hero";
import { ProjectProgressGrid } from "@/components/section/project_progress/project_progress_grid";

export const metadata: Metadata = {
  title: "Project Progress | Premium Homes Ltd.",
  description:
    "Track the progress of our communities as they take shape - from foundation to handover.",
};

export default function ProjectProgressPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <ProjectProgressHero />
        <ProjectProgressGrid />
      </main>
      <Footer />
    </div>
  );
}
