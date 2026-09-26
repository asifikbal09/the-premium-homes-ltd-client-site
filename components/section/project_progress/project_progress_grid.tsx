"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

const PROJECTS_DATA: ProjectProgressItem[] = [
  {
    id: "1",
    name: "The Green Vally",
    location: "Bashundhara R/A, Dhaka",
    category: "ONGOING",
    progress: 65,
    currentStage: "Structural Work",
    handover: "Dec 2027",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/1",
  },
  {
    id: "2",
    name: "The Green Vally",
    location: "Bashundhara R/A, Dhaka",
    category: "ONGOING",
    progress: 65,
    currentStage: "Brick & Plaster",
    handover: "Dec 2027",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/2",
  },
  {
    id: "3",
    name: "The Green Vally",
    location: "Bashundhara R/A, Dhaka",
    category: "ONGOING",
    progress: 65,
    currentStage: "Foundation",
    handover: "Dec 2027",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/3",
  },
  {
    id: "4",
    name: "The Green Vally",
    location: "Bashundhara R/A, Dhaka",
    category: "ONGOING",
    progress: 65,
    currentStage: "Structural Work",
    handover: "Dec 2027",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/4",
  },
  {
    id: "5",
    name: "The Green Vally",
    location: "Gulshan, Dhaka",
    category: "ONGOING",
    progress: 65,
    currentStage: "Structural Work",
    handover: "Dec 2027",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/5",
  },
  {
    id: "6",
    name: "The Green Vally",
    location: "Banani, Dhaka",
    category: "ONGOING",
    progress: 65,
    currentStage: "Structural Work",
    handover: "Dec 2027",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/6",
  },
  {
    id: "7",
    name: "The Green Vally",
    location: "Uttara, Dhaka",
    category: "UPCOMING",
    progress: 25,
    currentStage: "Piling & Foundation",
    handover: "Dec 2028",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/7",
  },
  {
    id: "8",
    name: "The Green Vally",
    location: "Dhanmondi, Dhaka",
    category: "UPCOMING",
    progress: 15,
    currentStage: "Site Preparation",
    handover: "Mar 2029",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/8",
  },
  {
    id: "9",
    name: "The Green Vally",
    location: "Bashundhara R/A, Dhaka",
    category: "COMPLETED",
    progress: 100,
    currentStage: "Handover Completed",
    handover: "Dec 2025",
    image: "/image/progress/tph_green_valley.png",
    href: "/project-progress/9",
  },
];

const TABS = ["ALL", "ONGOING", "UPCOMING", "COMPLETED"] as const;
type TabType = (typeof TABS)[number];

export function ProjectProgressGrid() {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Extract unique locations
  const locations = useMemo(() => {
    const locSet = new Set(PROJECTS_DATA.map((p) => p.location));
    return ["ALL", ...Array.from(locSet)];
  }, []);

  // Filter projects based on tab, search, and location
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
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
  }, [activeTab, selectedLocation, searchQuery]);

  return (
    <section
      aria-label="Explore Project Progress"
      className="w-full bg-[#fbf9f5] py-16 sm:py-20 md:py-24 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#083327] tracking-tight mb-8 sm:mb-10">
          Explore Project Progress
        </h2>

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
                  {selectedLocation === "ALL" ? "LOCATION" : selectedLocation.split(",")[0]}
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
                          "w-full text-left px-4 py-2 text-xs uppercase tracking-wide transition-colors",
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

        {/* 9 Cards Grid */}
        {filteredProjects.length === 0 ? (
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
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[#083327]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
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
                    <h3 className="font-heading text-xl sm:text-[22px] font-medium text-[#083327] tracking-tight leading-snug">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6e7d75] mt-1">
                      <MapPin className="h-3 w-3 text-[#6e7d75] shrink-0" />
                      <span>{project.location}</span>
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
                        style={{ width: `${project.progress}%` }}
                        className="h-full bg-[#c59e5f] rounded-full transition-all duration-700 ease-out"
                      />
                    </div>
                  </div>

                  {/* Current Stage & Handover */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/5">
                    <div>
                      <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-[#7d8b84]">
                        CURRENT STAGE
                      </span>
                      <span className="block font-heading text-sm sm:text-base font-normal text-[#083327] mt-0.5">
                        {project.currentStage}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-[#7d8b84]">
                        HANDOVER
                      </span>
                      <span className="block font-heading text-sm sm:text-base font-normal text-[#083327] mt-0.5">
                        {project.handover}
                      </span>
                    </div>
                  </div>

                  {/* View Progress Action Button */}
                  <div className="mt-5 pt-1">
                    <Link
                      href={project.href || `/project-progress/${project.id}`}
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
