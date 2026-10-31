import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProgressAroundHome } from "@/components/section/project_progress/progress_around_home";
import { ProgressDetailsHero } from "@/components/section/project_progress/progress_details_hero";
import { ProgressFloorPlan } from "@/components/section/project_progress/progress_floor_plan";
import { ProgressGallery } from "@/components/section/project_progress/progress_gallery";
import { ProgressLiveCamera } from "@/components/section/project_progress/progress_live_camera";
import { ProgressOverviewTimeline } from "@/components/section/project_progress/progress_overview_timeline";
import { ProgressSpecsGrid } from "@/components/section/project_progress/progress_specs_grid";

export const metadata: Metadata = {
  title: "TPH Green Valley - Project Progress | Premium Homes",
  description:
    "Explore real-time construction progress, milestone timeline, specifications, spacious floor plans, project gallery, and surrounding locations for TPH Green Valley.",
};

export default function ProjectProgressDetailsStaticPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-white text-[#1f2723]">
      <Navbar />
      <main className="w-full flex-1">
        <ProgressDetailsHero
          projectName="TPH Green Valley"
          location="Bashundhara R/A, Dhaka"
          tagline="A thoughtfully designed community for modern living."
          progressPercentage={65}
          expectedHandover="Dec 2027"
        />
        <ProgressOverviewTimeline />
        <ProgressLiveCamera />
        <ProgressSpecsGrid />
        <ProgressFloorPlan />
        <ProgressGallery />
        <ProgressAroundHome />
      </main>
      <Footer />
    </div>
  );
}
