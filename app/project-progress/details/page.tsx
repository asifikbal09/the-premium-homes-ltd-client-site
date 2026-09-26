import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProgressDetailsHero } from "@/components/section/project_progress/progress_details_hero";
import { ProgressSpecsGrid } from "@/components/section/project_progress/progress_specs_grid";
import { ProgressOverviewTimeline } from "@/components/section/project_progress/progress_overview_timeline";
import { ProgressLiveCamera } from "@/components/section/project_progress/progress_live_camera";
import { ProgressFloorPlan } from "@/components/section/project_progress/progress_floor_plan";
import { ProgressGallery } from "@/components/section/project_progress/progress_gallery";
import { ProgressAroundHome } from "@/components/section/project_progress/progress_around_home";

export const metadata: Metadata = {
  title: "TPH Green Valley - Project Progress | Premium Homes",
  description:
    "Explore real-time construction progress, milestone timeline, specifications, spacious floor plans, project gallery, and surrounding locations for TPH Green Valley.",
};

export default function ProjectProgressDetailsStaticPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1f2723]">
      <Navbar />
      <main className="flex-1 w-full">
        <ProgressDetailsHero
          projectName="TPH Green Valley"
          location="Bashundhara R/A, Dhaka"
          tagline="A thoughtfully designed community for modern living."
          progressPercentage={65}
          expectedHandover="Dec 2027"
        />
        <ProgressSpecsGrid />
        <ProgressOverviewTimeline />
        <ProgressLiveCamera />
        <ProgressFloorPlan />
        <ProgressGallery />
        <ProgressAroundHome />
      </main>
      <Footer />
    </div>
  );
}
