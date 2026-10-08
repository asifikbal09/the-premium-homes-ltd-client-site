"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// API endpoint for construction projects progress
// Can be changed manually or overridden via NEXT_PUBLIC_CONSTRUCTION_PROGRESS_API
export const CONSTRUCTION_PROGRESS_API =
  process.env.NEXT_PUBLIC_CONSTRUCTION_PROGRESS_API ||
  "http://127.0.0.1:8000/api/construction-projects-progress";

export interface WorkCategoryProgress {
  structural_work?: string;
  brick_work?: string;
  electrical_work?: string;
  plumbing_work?: string;
  tiles_work?: string;
  paint_work?: string;
  [key: string]: string | undefined;
}

export interface ApiConstructionProject {
  property_id: number;
  property_name?: string;
  name?: string;
  lastUpdatedDate?: string;
  lastMonthTarget?: string;
  lastMonthAchieved?: string;
  work_category_progress?: WorkCategoryProgress;
  image?: string;
  location?: string;
  slug?: string;
  category?: "ONGOING" | "UPCOMING" | "COMPLETED";
  status?: string;
  progress?: number;
  handover?: string;
}

export interface ProjectProgressItem {
  id: string;
  name: string;
  location: string;
  category: "ONGOING" | "UPCOMING" | "COMPLETED";
  progress: number;
  currentStage: string;
  handover: string;
  image: string;
  href?: string;
  slug?: string;
  lastUpdatedDate?: string;
}

const STAGE_ORDER: { key: string; label: string }[] = [
  { key: "paint_work", label: "Paint Work" },
  { key: "tiles_work", label: "Tiles Work" },
  { key: "plumbing_work", label: "Plumbing Work" },
  { key: "electrical_work", label: "Electrical Work" },
  { key: "brick_work", label: "Brick Work" },
  { key: "structural_work", label: "Structural Work" },
];

function parsePercentage(val?: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : num;
}

function determineStage(workProgress?: WorkCategoryProgress): string {
  if (!workProgress) return "Site Preparation";

  for (const stage of STAGE_ORDER) {
    const val = parsePercentage(workProgress[stage.key]);
    if (val > 0) {
      if (val >= 100 && stage.key === "paint_work") {
        return "Finishing & Handover";
      }
      return stage.label;
    }
  }

  return "Site Preparation";
}

function calculateOverallProgress(
  directProgress?: number,
  workProgress?: WorkCategoryProgress
): number {
  if (typeof directProgress === "number" && !isNaN(directProgress)) {
    return directProgress;
  }
  if (!workProgress) return 0;

  const entries = Object.entries(workProgress);
  if (entries.length === 0) return 0;

  const total = entries.reduce(
    (sum, [, val]) => sum + parsePercentage(val),
    0
  );

  // Total summed percentage of milestones completed so far (capped at 100)
  const capped = Math.min(100, Math.max(0, total));
  return Number(capped.toFixed(capped % 1 === 0 ? 0 : 1));
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function mapApiItemToProject(
  item: ApiConstructionProject,
  index: number
): ProjectProgressItem {
  const name =
    item.name || item.property_name || `Project ${item.property_id || index + 1}`;
  const location = item.location || "Ashulia Model Town";
  const progress = calculateOverallProgress(
    item.progress,
    item.work_category_progress
  );
  const currentStage = determineStage(item.work_category_progress);

  let category: "ONGOING" | "UPCOMING" | "COMPLETED" = "ONGOING";
  if (item.category) {
    category = item.category;
  } else if (item.status) {
    const s = item.status.toLowerCase();
    if (s.includes("complete")) category = "COMPLETED";
    else if (s.includes("upcoming")) category = "UPCOMING";
    else category = "ONGOING";
  } else {
    if (progress >= 100) category = "COMPLETED";
    else if (progress === 0 && currentStage === "Site Preparation") {
      category = "UPCOMING";
    } else {
      category = "ONGOING";
    }
  }

  const handover =
    item.handover ||
    (item.lastUpdatedDate ? formatDate(item.lastUpdatedDate) : "Dec 2027");

  return {
    id: String(item.property_id || index + 1),
    name,
    location,
    category,
    progress,
    currentStage,
    handover,
    image: item.image || "/image/progress/tph_green_valley.png",
    slug: item.slug,
    href: `/project-progress/${item.slug || item.property_id || index + 1}`,
    lastUpdatedDate: item.lastUpdatedDate,
  };
}

const FALLBACK_PROJECTS: ProjectProgressItem[] = [
  {
    id: "15",
    name: "The Premium Studio Suite 3.0",
    location: "Ashulia Model Town",
    category: "ONGOING",
    progress: 5.3,
    currentStage: "Structural Work",
    handover: "03 Sep 2024",
    lastUpdatedDate: "2024-09-03",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a2e33d7a8e06.png",
    href: "/project-progress/the-premium-studio-suite-30",
  },
  {
    id: "17",
    name: "The Premium Southpoint Villa",
    location: "Ashulia Model Town",
    category: "ONGOING",
    progress: 2.5,
    currentStage: "Structural Work",
    handover: "03 Sep 2024",
    lastUpdatedDate: "2024-09-03",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a2e2fab5868d.png",
    href: "/project-progress/the-premium-southpoint-villa",
  },
  {
    id: "22",
    name: "The Premium Lake View Terrace",
    location: "Ashulia Model Town",
    category: "ONGOING",
    progress: 1.2,
    currentStage: "Structural Work",
    handover: "03 Sep 2024",
    lastUpdatedDate: "2024-09-03",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a2e2aa048b1c.png",
    href: "/project-progress/the-premium-lake-view-terrace",
  },
  {
    id: "34",
    name: "The Premium Southern Residence",
    location: "Ashulia Model Town",
    category: "ONGOING",
    progress: 5.3,
    currentStage: "Structural Work",
    handover: "03 Sep 2024",
    lastUpdatedDate: "2024-09-03",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a2e2d5abb3f0.png",
    href: "/project-progress/the-premium-southern-residence",
  },
];

const TABS = ["ALL", "ONGOING", "UPCOMING", "COMPLETED"] as const;
type TabType = (typeof TABS)[number];

export function ProjectProgressGrid() {
  const [projects, setProjects] = useState<ProjectProgressItem[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(CONSTRUCTION_PROGRESS_API)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        const rawList: ApiConstructionProject[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        if (rawList.length > 0) {
          const mapped = rawList.map((item, idx) =>
            mapApiItemToProject(item, idx)
          );
          setProjects(mapped);
        }
      })
      .catch((err) => {
        console.warn(
          "Failed to load project progress from API, using fallback data:",
          err
        );
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Extract unique locations from loaded projects
  const locations = useMemo(() => {
    const locSet = new Set(
      projects.map((p) => p.location).filter(Boolean)
    );
    return ["ALL", ...Array.from(locSet)];
  }, [projects]);

  // Filter projects based on tab, search, and location
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Tab filter
      if (activeTab !== "ALL" && project.category !== activeTab) {
        return false;
      }
      // Location filter
      if (selectedLocation !== "ALL" && project.location !== selectedLocation) {
        return false;
      }
      // Search query filter (matches name, location, current stage)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesLoc = project.location.toLowerCase().includes(query);
        const matchesStage = project.currentStage.toLowerCase().includes(query);
        if (!matchesName && !matchesLoc && !matchesStage) {
          return false;
        }
      }
      return true;
    });
  }, [projects, activeTab, selectedLocation, searchQuery]);

  return (
    <section
      aria-label="Explore Project Progress"
      className="w-full bg-[#fbf9f5] py-16 sm:py-20 md:py-24 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8 sm:mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#083327] tracking-tight">
            Explore Project Progress
          </h2>
          {!loading && (
            <span className="text-xs uppercase tracking-widest text-[#6e7d75] font-medium">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "Project" : "Projects"}
            </span>
          )}
        </div>

        {/* Filter & Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 sm:mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-[#083327] text-white shadow-sm"
                      : "bg-white/80 hover:bg-white text-[#4a5851] border border-black/10 hover:border-black/20 shadow-xs"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Search & Location */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PROJECT"
                aria-label="Search projects"
                className="w-full bg-white/90 border border-black/10 rounded-full pl-9 pr-4 py-2 text-xs text-[#1f2723] placeholder:text-[#84928b] placeholder:tracking-[0.12em] focus:outline-none focus:border-[#083327] shadow-xs uppercase tracking-wider font-sans transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#84928b] pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#84928b] hover:text-[#083327]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-[0.12em] uppercase bg-white/90 hover:bg-white text-[#4a5851] border border-black/10 hover:border-black/20 shadow-xs transition-all cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-[#84928b]" />
                <span>
                  {selectedLocation === "ALL"
                    ? "LOCATION"
                    : selectedLocation.split(",")[0]}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-[#84928b] transition-transform duration-200",
                    locationDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {locationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setLocationDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-black/10 shadow-xl py-1.5 z-30 overflow-hidden font-sans">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-xs uppercase tracking-wide transition-colors cursor-pointer",
                          selectedLocation === loc
                            ? "bg-[#083327]/10 text-[#083327] font-semibold"
                            : "text-[#4a5851] hover:bg-black/5"
                        )}
                      >
                        {loc === "ALL" ? "All Locations" : loc}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-black/[0.08] p-4 shadow-sm animate-pulse"
              >
                <div className="w-full aspect-[16/10] rounded-xl bg-black/10" />
                <div className="pt-4 space-y-3">
                  <div className="h-5 bg-black/10 rounded-md w-3/4" />
                  <div className="h-3.5 bg-black/5 rounded-md w-1/2" />
                  <div className="pt-3 border-t border-black/5 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 bg-black/10 rounded w-1/3" />
                      <div className="h-5 bg-black/10 rounded w-10" />
                    </div>
                    <div className="h-2 bg-black/5 rounded-full w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-black/5">
                    <div className="h-8 bg-black/5 rounded" />
                    <div className="h-8 bg-black/5 rounded" />
                  </div>
                  <div className="h-10 bg-black/5 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
            <p className="font-sans text-sm text-[#5a6a62]">
              No projects found matching the selected filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("ALL");
                setSearchQuery("");
                setSelectedLocation("ALL");
              }}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[#083327] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl bg-white border border-black/[0.08] p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with inner padding/rounding */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/10">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Content */}
                <div className="pt-4 px-1 flex-1 flex flex-col justify-between">
                  {/* Name and Location */}
                  <div>
                    <h3 className="font-heading text-xl sm:text-[22px] font-medium text-[#083327] tracking-tight leading-snug line-clamp-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6e7d75] mt-1">
                      <MapPin className="h-3 w-3 text-[#6e7d75] shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-4 pt-3 border-t border-black/5">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.14em] uppercase text-[#6e7d75]">
                        <Sparkles className="h-3 w-3 text-[#c59e5f] shrink-0" />
                        <span>PROJECT PROGRESS</span>
                      </div>
                      <span className="font-heading text-2xl sm:text-[28px] font-normal text-[#c59e5f] leading-none">
                        {project.progress}%
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div
                      role="progressbar"
                      aria-valuenow={project.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${project.name} progress ${project.progress}%`}
                      className="w-full h-2 bg-[#f0e8db] rounded-full overflow-hidden mt-2 relative"
                    >
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, project.progress)
                          )}%`,
                        }}
                        className="h-full bg-[#c59e5f] rounded-full transition-all duration-700 ease-out"
                      />
                    </div>
                  </div>

                  {/* Current Stage & Handover / Last Updated */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/5">
                    <div>
                      <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-[#7d8b84]">
                        CURRENT STAGE
                      </span>
                      <span className="block font-heading text-sm sm:text-base font-normal text-[#083327] mt-0.5 truncate">
                        {project.currentStage}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-[#7d8b84]">
                        {project.lastUpdatedDate ? "LAST UPDATED" : "HANDOVER"}
                      </span>
                      <span className="block font-heading text-sm sm:text-base font-normal text-[#083327] mt-0.5 truncate">
                        {project.lastUpdatedDate
                          ? formatDate(project.lastUpdatedDate)
                          : project.handover}
                      </span>
                    </div>
                  </div>

                  {/* View Progress Action Button */}
                  <div className="mt-5 pt-1">
                    <Link
                      href={
                        project.href ||
                        `/project-progress/${project.slug || project.id}`
                      }
                      className="w-full inline-flex items-center justify-center py-2.5 rounded-full text-xs font-semibold tracking-[0.14em] uppercase text-[#083327] border border-[#083327]/30 hover:bg-[#083327] hover:text-white transition-all duration-300 shadow-2xs active:scale-[0.98]"
                    >
                      VIEW PROGRESS
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

