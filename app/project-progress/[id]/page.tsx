import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProgressDetailsHero } from "@/components/section/project_progress/progress_details_hero";
import { ProgressSpecsGrid } from "@/components/section/project_progress/progress_specs_grid";
import { ProgressOverviewTimeline } from "@/components/section/project_progress/progress_overview_timeline";
import { ProgressLiveCamera } from "@/components/section/project_progress/progress_live_camera";
import { ProgressFloorPlan } from "@/components/section/project_progress/progress_floor_plan";
import { ProgressGallery } from "@/components/section/project_progress/progress_gallery";
import { ProgressAroundHome } from "@/components/section/project_progress/progress_around_home";
import { Building2, ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function parsePercentage(val?: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : Math.round(num);
}

async function getProjectProgressData(paramId: string) {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");

  let slug = paramId;

  // If paramId is numeric, resolve the slug first from /constructions/projects-progress
  if (/^\d+$/.test(paramId)) {
    try {
      const listRes = await fetch(`${baseUrl}/constructions/projects-progress`, {
        cache: "no-store",
      });
      if (listRes.ok) {
        const listJson = await listRes.json();
        const list = Array.isArray(listJson?.data) ? listJson.data : [];
        const found = list.find((p: any) => String(p.property_id) === String(paramId));
        if (found?.project_slug) {
          slug = found.project_slug;
        }
      }
    } catch (err) {
      console.warn("Could not resolve slug for numeric id:", err);
    }
  }

  try {
    const res = await fetch(
      `${baseUrl}/constructions/projects-progress/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      const project = Array.isArray(json?.data) ? json.data[0] : json?.data || null;
      const cameras =
        Array.isArray(project?.cameras) && project.cameras.length > 0
          ? project.cameras
          : Array.isArray(json?.cameras)
          ? json.cameras
          : [];
      return { project, cameras };
    }
  } catch (err) {
    console.error("Error fetching project progress details:", err);
  }
  return { project: null, cameras: [] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { project } = await getProjectProgressData(id);

  const title = project?.project_name || project?.property_name || "Project Progress";
  return {
    title: `${title} - Real-Time Construction Progress | Premium Homes`,
    description: `Explore live engineering progress, milestones, specifications, and architecture updates for ${title}.`,
  };
}

export default async function ProjectProgressDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const { project, cameras } = await getProjectProgressData(id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white text-[#1f2723]">
        <Navbar />
        <main className="flex-1 w-full flex items-center justify-center p-8 min-h-[60vh]">
          <div className="text-center max-w-md bg-stone-50 border border-stone-200/80 rounded-2xl p-8 sm:p-10 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-stone-200/70 flex items-center justify-center text-stone-500 mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl font-normal text-[#083327]">
              Project Progress Not Found
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
              We couldn&apos;t load the construction progress details for this project. It might have been updated or moved.
            </p>
            <div className="mt-6">
              <Link
                href="/project-progress"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#083327] hover:bg-[#0a4132] text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>All Projects Progress</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const projectName = project.project_name || project.property_name || "Development Project";
  const location = project.project_location || project.location || "Bangladesh";
  const progressPct = parsePercentage(project.overall_progress);
  const handoverDate = project.handover || "";
  const tagline = project.delivery || project.hotelOperation || "";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1f2723]">
      <Navbar />
      <main className="flex-1 w-full">
        {/* 1. Dynamic Hero Section */}
        <ProgressDetailsHero
          projectName={projectName}
          location={location}
          tagline={tagline}
          progressPercentage={progressPct}
          expectedHandover={handoverDate}
          status={progressPct >= 100 ? "COMPLETED" : "ONGOING PROJECT"}
        />

        {/* 2. Key Specifications Grid */}
        <ProgressSpecsGrid
          location={location}
          landArea={project.land_area}
          totalShare={project.total_share}
          buildingType={project.buildingType}
          buildingFace={project.buildingFace}
          frontRoad={project.frontRoad}
          passengerLift={project.passengerLift}
          expectedHandover={handoverDate}
          suiteSizes={project.suiteSizes}
          unitPerFloor={project.unitPerFloor}
        />

        {/* 3. Milestone Timeline */}
        <ProgressOverviewTimeline
          overviewText={
            project.hotelOperation
              ? `${projectName} offers premium residential suites with dedicated hospitality management by ${project.hotelOperation}. Constructed strictly in accordance with BNBC engineering standards.`
              : undefined
          }
          workCategoryProgress={project.work_category_progress}
          constructionStart={project.constructionStart}
          expectedHandover={handoverDate}
        />

        {/* 4. Live Camera & Real Progress Breakdown */}
        <ProgressLiveCamera
          cameras={cameras}
          workCategoryProgress={project.work_category_progress}
          fallbackImage={project.project_image}
        />

        {/* 5. Floor Plan & Unit Specs */}
        <ProgressFloorPlan
          buildingType={project.buildingType}
          totalShare={project.total_share}
          unitPerFloor={project.unitPerFloor}
          frontRoad={project.frontRoad}
          passengerLift={project.passengerLift}
          cargoLift={project.cargoLift}
          carParking={project.carParking}
          electricityBackup={project.electricityBackup}
          suiteSizes={project.suiteSizes}
          hotelOperation={project.hotelOperation}
          delivery={project.delivery}
          image={project.project_image}
          projectName={projectName}
        />

        {/* 6. Dynamic Amenities & Highlights Gallery */}
        <ProgressGallery
          amenities={project.amenities}
          projectImage={project.project_image}
          projectName={projectName}
        />

        {/* 7. Nearby Locations Map */}
        <ProgressAroundHome location={location} projectName={projectName} />
      </main>
      <Footer />
    </div>
  );
}
