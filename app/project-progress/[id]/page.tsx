import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ChevronLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProgressAroundHome } from "@/components/section/project_progress/progress_around_home";
import { ProgressDetailsHero } from "@/components/section/project_progress/progress_details_hero";
import { ProgressFloorPlan } from "@/components/section/project_progress/progress_floor_plan";
import { ProgressGallery } from "@/components/section/project_progress/progress_gallery";
import { ProgressLiveCamera } from "@/components/section/project_progress/progress_live_camera";
import { ProgressOverviewTimeline } from "@/components/section/project_progress/progress_overview_timeline";
import { ProgressSpecsGrid } from "@/components/section/project_progress/progress_specs_grid";

interface PageProps {
  params: Promise<{ id: string }>;
}

function parsePercentage(val?: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : Math.round(num);
}

function normalizeProjectName(name?: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/^(the\s+)?(premium\s+)?/i, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
      const listRes = await fetch(
        `${baseUrl}/constructions/projects-progress`,
        {
          cache: "no-store",
        },
      );
      if (listRes.ok) {
        const listJson = await listRes.json();
        const list = Array.isArray(listJson?.data) ? listJson.data : [];
        const found = list.find(
          (p: any) => String(p.property_id) === String(paramId),
        );
        if (found?.project_slug) {
          slug = found.project_slug;
        }
      }
    } catch (err) {
      console.warn("Could not resolve slug for numeric id:", err);
    }
  }

  try {
    const [res, camRes] = await Promise.allSettled([
      fetch(
        `${baseUrl}/constructions/projects-progress/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      ),
      fetch(`${baseUrl}/cameras`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }),
    ]);

    if (res.status === "fulfilled" && res.value.ok) {
      const json = await res.value.json();
      const project = Array.isArray(json?.data)
        ? json.data[0]
        : json?.data || null;

      if (!project) {
        return { project: null, cameras: [] };
      }

      const rawInlineCameras =
        Array.isArray(project?.cameras) && project.cameras.length > 0
          ? project.cameras
          : Array.isArray(json?.cameras)
            ? json.cameras
            : [];

      let allApiCameras: any[] = [];
      if (camRes.status === "fulfilled" && camRes.value.ok) {
        try {
          const camJson = await camRes.value.json();
          allApiCameras = Array.isArray(camJson?.cameras)
            ? camJson.cameras
            : Array.isArray(camJson?.data)
              ? camJson.data
              : [];
        } catch {
          allApiCameras = [];
        }
      }

      const targetPropId = Number(project.property_id) || 0;
      const normProjName = normalizeProjectName(
        project.project_name || project.property_name,
      );

      const matchedCameras: any[] = [];
      const seenLinks = new Set<string>();

      // 1. Match rich camera records from /api/cameras for this specific project
      for (const cam of allApiCameras) {
        if (!cam) continue;
        const camProjId = Number(cam.project_id) || 0;
        const normCamProj = normalizeProjectName(cam.project_name);

        const isIdMatch = targetPropId > 0 && camProjId === targetPropId;
        const isNameMatch =
          (!targetPropId || !camProjId) &&
          Boolean(normProjName && normCamProj) &&
          normCamProj === normProjName;

        if (isIdMatch || isNameMatch) {
          const linkKey = String(cam.camera_link || cam.id || "").trim();
          if (linkKey && !seenLinks.has(linkKey)) {
            seenLinks.add(linkKey);
            matchedCameras.push(cam);
          }
        }
      }

      // 2. Merge any inline cameras from the project progress response not already present
      rawInlineCameras.forEach((item: any, idx: number) => {
        if (typeof item === "string") {
          const linkKey = item.trim();
          if (linkKey && !seenLinks.has(linkKey)) {
            seenLinks.add(linkKey);
            matchedCameras.push({
              id: `inline-cam-${idx + 1}`,
              camera_name: `Cam ${matchedCameras.length + 1}`,
              camera_link: linkKey,
            });
          }
        } else if (item && typeof item === "object") {
          const linkKey = String(
            item.camera_link || item.stream_url || item.url || item.id || "",
          ).trim();
          if (linkKey && !seenLinks.has(linkKey)) {
            seenLinks.add(linkKey);
            matchedCameras.push(item);
          }
        }
      });

      return { project, cameras: matchedCameras };
    }
  } catch (err) {
    console.error("Error fetching project progress details:", err);
  }
  return { project: null, cameras: [] };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { project } = await getProjectProgressData(id);

  const title =
    project?.project_name || project?.property_name || "Project Progress";
  return {
    title: `${title} - Real-Time Construction Progress | Premium Homes`,
    description: `Explore live engineering progress, milestones, specifications, and architecture updates for ${title}.`,
  };
}

export default async function ProjectProgressDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const { project, cameras } = await getProjectProgressData(id);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-white text-[#1f2723]">
        <Navbar />
        <main className="flex min-h-[60vh] w-full flex-1 items-center justify-center p-8">
          <div className="max-w-md rounded-2xl border border-stone-200/80 bg-stone-50 p-8 text-center shadow-xs sm:p-10">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-stone-200/70 text-stone-500">
              <Building2 className="size-8" />
            </div>
            <h2 className="font-display text-2xl font-normal text-[#054b3c]">
              Project Progress Not Found
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-stone-500 sm:text-sm">
              We couldn&apos;t load the construction progress details for this
              project. It might have been updated or moved.
            </p>
            <div className="mt-6">
              <Link
                href="/project-progress"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#054b3c] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#09221c]"
              >
                <ChevronLeft className="size-4" />
                <span>All Projects Progress</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const projectName =
    project.project_name || project.property_name || "Development Project";
  const location =
    project.project_location || project.location || "Bangladesh";
  const progressPct = parsePercentage(project.overall_progress);
  const handoverDate = project.handover || "";
  const tagline = project.delivery || project.hotelOperation || "";

  return (
    <div className="flex min-h-screen flex-col justify-between bg-white text-[#1f2723]">
      <Navbar />
      <main className="w-full flex-1">
        {/* 1. Dynamic Hero Section */}
        <ProgressDetailsHero
          projectName={projectName}
          location={location}
          tagline={
            tagline || "A thoughtfully designed community for modern living."
          }
          progressPercentage={progressPct}
          expectedHandover={handoverDate}
          status={progressPct >= 100 ? "completed project" : "ongoing project"}
        />

        {/* 2. Project Overview & Milestone Timeline */}
        <ProgressOverviewTimeline
          overviewText={
            project.hotelOperation
              ? `${projectName} offers premium residential suites with dedicated hospitality management by ${project.hotelOperation}. Constructed strictly in accordance with BNBC engineering standards.`
              : undefined
          }
          workCategoryProgress={project.work_category_progress}
          constructionStart={project.constructionStart}
          expectedHandover={handoverDate}
          projectName={projectName}
        />

        {/* 3. Live Camera & Real Progress Breakdown */}
        <ProgressLiveCamera
          cameras={cameras}
          workCategoryProgress={project.work_category_progress}
          fallbackImage={project.project_image}
          overallProgress={progressPct}
          projectName={projectName}
        />

        {/* 4. Key Specifications Grid */}
        <ProgressSpecsGrid
          location={location}
          landArea={project.land_area}
          totalShare={project.total_share}
          buildingType={project.buildingType}
          buildingFace={project.buildingFace}
          frontRoad={project.frontRoad}
          passengerLift={project.passengerLift}
          carParking={project.carParking}
          expectedHandover={handoverDate}
          suiteSizes={project.suiteSizes}
          unitPerFloor={project.unitPerFloor}
        />

        {/* 5. Spacious Floor Plans & Unit Specs */}
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
          image={project.floor_plan_image || project.image2}
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
