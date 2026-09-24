"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, MapPin, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/lib/projects";
import { ProjectCard } from "./project_card";

interface ProjectsFilterGridProps {
  initialProjects: ProjectData[];
}

type StatusTab = "ALL" | "ONGOING" | "COMPLETED";

export function ProjectsFilterGrid({
  initialProjects,
}: ProjectsFilterGridProps) {
  // --- States ---
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [locationOpen, setLocationOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const locationRef = useRef<HTMLDivElement>(null);

  // --- Debounce Implementation for Search Input ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 280);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Adjust pagination during render when filter or search changes (React recommended pattern)
  const [prevFilterKey, setPrevFilterKey] = useState(
    `${activeTab}-${debouncedQuery}-${selectedLocation}`,
  );
  const currentFilterKey = `${activeTab}-${debouncedQuery}-${selectedLocation}`;

  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(6);
  }

  // Click outside listener for location dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Distinct Locations from dataset ---
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.location && p.location.trim()) {
        locSet.add(p.location.trim());
      }
    });
    return Array.from(locSet);
  }, [initialProjects]);

  // --- Filtering Logic ---
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // 1. Status Filter
      if (activeTab === "ONGOING") {
        const isOngoing =
          project.status?.toLowerCase().includes("ongoing") ||
          project.under_construction === 1;
        if (!isOngoing) return false;
      } else if (activeTab === "COMPLETED") {
        const isCompleted =
          project.status?.toLowerCase().includes("sold") ||
          project.status?.toLowerCase().includes("complete") ||
          project.under_construction === 0;
        if (!isCompleted) return false;
      }

      // 2. Location Filter
      if (selectedLocation !== "ALL") {
        const matchesLoc =
          project.location
            ?.toLowerCase()
            .includes(selectedLocation.toLowerCase()) ||
          project.community?.name
            ?.toLowerCase()
            .includes(selectedLocation.toLowerCase());
        if (!matchesLoc) return false;
      }

      // 3. Debounced Search Query
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase().trim();
        const matchesName = project.name?.toLowerCase().includes(q);
        const matchesLoc = project.location?.toLowerCase().includes(q);
        const matchesDesc = project.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesDesc) return false;
      }

      return true;
    });
  }, [initialProjects, activeTab, selectedLocation, debouncedQuery]);

  // Visible projects slice
  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <div className="w-full">
      {/* FILTER & SEARCH CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-12">
        {/* Left Side: Status Pills (ALL, ONGOING PROJECT, COMPLETED PROJECTS) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* ALL Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "px-5 sm:px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95",
              activeTab === "ALL"
                ? "bg-[#044133] text-white shadow-xs"
                : "bg-transparent text-[#4f5c57] hover:text-[#044133] border border-[#d6cfbe] hover:border-[#044133]/40",
            )}
          >
            ALL
          </button>

          {/* ONGOING PROJECT Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("ONGOING")}
            className={cn(
              "px-5 sm:px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95",
              activeTab === "ONGOING"
                ? "bg-[#044133] text-white shadow-xs"
                : "bg-transparent text-[#4f5c57] hover:text-[#044133] border border-[#d6cfbe] hover:border-[#044133]/40",
            )}
          >
            ONGOING PROJECT
          </button>

          {/* COMPLETED PROJECTS Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("COMPLETED")}
            className={cn(
              "px-5 sm:px-6 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95",
              activeTab === "COMPLETED"
                ? "bg-[#044133] text-white shadow-xs"
                : "bg-transparent text-[#4f5c57] hover:text-[#044133] border border-[#d6cfbe] hover:border-[#044133]/40",
            )}
          >
            COMPLETED PROJECTS
          </button>
        </div>

        {/* Right Side: Search Field & Location Dropdown */}
        <div className="flex items-center gap-3">
          {/* Debounced Search Field */}
          <div className="relative flex items-center bg-white border border-[#d6cfbe] focus-within:border-[#044133] focus-within:ring-1 focus-within:ring-[#044133]/20 rounded-full px-4 py-2 transition-all w-full sm:w-60 md:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PROJECT"
              aria-label="Search Project"
              className="bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none w-full tracking-wider uppercase font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 text-xs ml-1 cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Location Dropdown */}
          <div className="relative" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationOpen((prev) => !prev)}
              aria-expanded={locationOpen}
              className={cn(
                "inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer select-none",
                locationOpen || selectedLocation !== "ALL"
                  ? "border-[#044133] text-[#044133] bg-[#044133]/5"
                  : "border-[#d6cfbe] text-[#4f5c57] hover:border-[#044133]/50 hover:text-[#044133]",
              )}
            >
              <MapPin className="w-3.5 h-3.5 text-[#044133]" />
              <span className="truncate max-w-[110px] sm:max-w-[140px]">
                {selectedLocation === "ALL" ? "LOCATION" : selectedLocation}
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                  locationOpen && "rotate-180 text-[#044133]",
                )}
              />
            </button>

            {/* Location Dropdown List */}
            {locationOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white border border-[#d6cfbe] rounded-2xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocation("ALL");
                    setLocationOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                    selectedLocation === "ALL"
                      ? "bg-[#044133] text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <span>All Locations</span>
                  {selectedLocation === "ALL" && (
                    <Check className="w-3.5 h-3.5 text-[#d0a65b]" />
                  )}
                </button>

                {availableLocations.map((loc) => {
                  const isSelected = selectedLocation === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setLocationOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer mt-0.5",
                        isSelected
                          ? "bg-[#044133] text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <span className="truncate">{loc}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#d0a65b] shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-COLUMN PROJECTS GRID */}
      {displayedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#d6cfbe] rounded-3xl bg-[#faf8f5]">
          <p className="font-heading text-2xl text-[#14261f]">
            No projects found
          </p>
          <p className="text-xs text-gray-500 max-w-md mt-2">
            No projects matched your selected filters or search query. Try
            adjusting your criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("ALL");
              setSelectedLocation("ALL");
              setSearchQuery("");
            }}
            className="mt-5 px-5 py-2 rounded-full bg-[#044133] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#032f25] transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* LOAD MORE PROJECTS BUTTON */}
      {hasMore && (
        <div className="flex justify-center mt-12 sm:mt-16">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="inline-flex items-center justify-center px-8 sm:px-11 py-3.5 sm:py-4 rounded-full bg-[#044133] hover:bg-[#032f25] text-white text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            LOAD MORE PROJECTS
          </button>
        </div>
      )}
    </div>
  );
}
