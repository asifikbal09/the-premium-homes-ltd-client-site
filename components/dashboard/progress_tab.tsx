"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, Building2, ChevronRight, Loader2 } from "lucide-react";
import { ClientFlat, ClientUser } from "./types";

interface ProgressTabProps {
  myFlats?: ClientFlat[];
  user?: ClientUser | null;
  isLoading?: boolean;
}

interface WorkCategoryProgress {
  structural_work?: string;
  plaster_work?: string;
  brick_work?: string;
  electrical_work?: string;
  plumbing_work?: string;
  tiles_work?: string;
  paint_work?: string;
  [key: string]: string | undefined;
}

interface ApiConstructionProgressItem {
  property_id: number;
  property_name?: string;
  lastUpdatedDate?: string;
  lastMonthTarget?: string;
  lastMonthAchieved?: string;
  totalProgress?: string;
  work_category_progress?: WorkCategoryProgress;
  project_name?: string;
  project_slug?: string;
  project_location?: string;
  project_image?: string;
  overall_progress?: string;
}

interface UserProjectCard {
  id: string | number;
  propertyId: number;
  title: string;
  flatNo?: string;
  location: string;
  image: string;
  progress: number;
  currentStage: string;
  handover: string;
  slug: string;
}

const STAGE_ORDER: { key: string; label: string }[] = [
  { key: "paint_work", label: "Paint Work" },
  { key: "tiles_work", label: "Tiles Work" },
  { key: "plumbing_work", label: "Plumbing Work" },
  { key: "electrical_work", label: "Electrical Work" },
  { key: "brick_work", label: "Brick & Plaster" },
  { key: "plaster_work", label: "Brick & Plaster" },
  { key: "structural_work", label: "Structural Work" },
];

function parsePercentage(val?: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : num;
}

function determineStage(workProgress?: WorkCategoryProgress): string {
  if (!workProgress) return "Structural Work";

  for (const stage of STAGE_ORDER) {
    const val = parsePercentage(workProgress[stage.key]);
    if (val > 0) {
      if (val >= 100 && stage.key === "paint_work") {
        return "Finishing & Handover";
      }
      return stage.label;
    }
  }

  return "Structural Work";
}

function calculateOverallProgress(
  overallStr?: string,
  totalProg?: string,
  workProgress?: WorkCategoryProgress
): number {
  if (overallStr !== undefined && overallStr !== null && overallStr !== "") {
    return Math.round(parsePercentage(overallStr));
  }
  if (totalProg !== undefined && totalProg !== null && totalProg !== "") {
    return Math.round(parsePercentage(totalProg));
  }
  if (workProgress) {
    const values = Object.values(workProgress).map((v) => parsePercentage(v));
    if (values.length > 0) {
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      return Math.round(avg);
    }
  }
  return 0;
}

export function ProgressTab({
  myFlats = [],
  user,
  isLoading: isParentLoading = false,
}: ProgressTabProps) {
  const [projectCards, setProjectCards] = useState<UserProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProjectProgressData() {
      try {
        setLoading(true);
        const baseUrl = (
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.dpremiumhomes.com/api"
        ).replace(/\/+$/, "");

        // 1. Fetch constructions projects progress and all projects in parallel
        const [progressRes, projectsRes] = await Promise.allSettled([
          fetch(`${baseUrl}/constructions/projects-progress`, { cache: "no-store" }),
          fetch(`${baseUrl}/projects`, { cache: "no-store" }),
        ]);

        let progressList: ApiConstructionProgressItem[] = [];
        if (progressRes.status === "fulfilled" && progressRes.value.ok) {
          const json = await progressRes.value.json();
          progressList = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
            ? json.data
            : [];
        }

        // Map project handover dates from /projects endpoint
        const handoverMap: Record<string, string> = {};
        const slugMap: Record<string, string> = {};
        if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
          try {
            const pJson = await projectsRes.value.json();
            const pList = Array.isArray(pJson)
              ? pJson
              : pJson?.projects || pJson?.data || [];
            if (Array.isArray(pList)) {
              pList.forEach((proj: any) => {
                if (proj) {
                  const handoverDate =
                    proj.handover ||
                    proj.handover_date ||
                    proj.delivery ||
                    proj.estimated_date ||
                    "";
                  if (proj.id && handoverDate) {
                    handoverMap[String(proj.id)] = handoverDate;
                  }
                  if (proj.slug && handoverDate) {
                    handoverMap[String(proj.slug)] = handoverDate;
                  }
                  if (proj.name && handoverDate) {
                    handoverMap[proj.name.toLowerCase().trim()] = handoverDate;
                  }
                  if (proj.id && proj.slug) {
                    slugMap[String(proj.id)] = proj.slug;
                  }
                }
              });
            }
          } catch (e) {
            console.warn("Could not parse projects handover list:", e);
          }
        }

        // 2. Resolve User's Projects strictly
        const userFlats = myFlats && myFlats.length > 0 ? myFlats : [];

        if (userFlats.length > 0) {
          const cards: UserProjectCard[] = userFlats.map((flat, idx) => {
            const rawPropId = Number(flat.project_id) || 0;
            const flatTitle = (flat.title || "").toLowerCase().trim();
            const flatSlug = flat.slug || "";

            // Find matching item from progress list
            const matchedProgress = progressList.find((p) => {
              if (rawPropId > 0 && p.property_id === rawPropId) return true;
              if (flatSlug && p.project_slug === flatSlug) return true;
              const pName = (p.project_name || p.property_name || "").toLowerCase().trim();
              if (pName && flatTitle && (pName === flatTitle || flatTitle.includes(pName) || pName.includes(flatTitle))) {
                return true;
              }
              return false;
            });

            // Handover Date resolution from /projects API or flat
            const resolvedHandover =
              (rawPropId && handoverMap[String(rawPropId)]) ||
              (flatSlug && handoverMap[flatSlug]) ||
              handoverMap[flatTitle] ||
              flat.handover_date ||
              "Dec 2027";

            // Fallback image handling
            const resolvedImage =
              matchedProgress?.project_image ||
              flat.image ||
              "/image/progress/tph_green_valley.png";

            const progressPct = calculateOverallProgress(
              matchedProgress?.overall_progress,
              matchedProgress?.totalProgress,
              matchedProgress?.work_category_progress
            );

            const stage = determineStage(matchedProgress?.work_category_progress);

            const resolvedSlug =
              matchedProgress?.project_slug ||
              (rawPropId && slugMap[String(rawPropId)]) ||
              flat.slug ||
              String(rawPropId || idx + 1);

            return {
              id: flat.id || `card-${rawPropId || idx}`,
              propertyId: matchedProgress?.property_id || rawPropId,
              title: matchedProgress?.project_name || matchedProgress?.property_name || flat.title,
              flatNo: flat.flatNo,
              location: matchedProgress?.project_location || flat.location || "Ashulia Model Town",
              image: resolvedImage,
              progress: progressPct,
              currentStage: stage,
              handover: resolvedHandover,
              slug: resolvedSlug,
            };
          });

          if (isMounted) {
            setProjectCards(cards);
          }
        } else {
          // If user currently has no flats in state, check if progress has matching projects
          if (isMounted) {
            setProjectCards([]);
          }
        }
      } catch (err) {
        console.error("Error loading project progress in ProgressTab:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProjectProgressData();

    return () => {
      isMounted = false;
    };
  }, [myFlats]);

  const showLoading = isParentLoading || loading;

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Construction & Handover Tracker
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Real-time engineering milestones and construction progress for your registered properties.
        </p>
      </div>

      {/* Skeletons Loading State */}
      {showLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {[1, 2].map((n) => (
            <div
              key={`progress-card-skeleton-${n}`}
              className="rounded-2xl bg-white border border-black/[0.08] p-3.5 sm:p-4 shadow-xs animate-pulse"
            >
              <div className="w-full aspect-[16/10] rounded-xl bg-black/10" />
              <div className="pt-4 space-y-3 px-1">
                <div className="h-5 bg-black/10 rounded-md w-3/4" />
                <div className="h-3.5 bg-black/5 rounded-md w-1/2" />
                <div className="pt-3 border-t border-black/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-black/10 rounded w-1/3" />
                    <div className="h-6 bg-black/10 rounded w-12" />
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
      ) : projectCards.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-10 sm:p-12 border border-stone-200/80 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            No Registered Property Progress Found
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-md leading-relaxed">
            You currently do not have any registered apartments or suites with active construction tracking in your account.
          </p>
          <div className="mt-5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#044133] hover:bg-[#065442] text-[#f7e7cb] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
            >
              <span>Explore Developments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* User Project Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {projectCards.map((card) => (
            <div
              key={card.id}
              className="group rounded-2xl bg-white border border-black/[0.08] p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container with Inner Padding / Rounding */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-stone-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {card.flatNo && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 text-[10.5px] font-semibold border border-white/60 shadow-xs">
                    Unit {card.flatNo}
                  </span>
                )}
              </div>

              {/* Card Content Body */}
              <div className="pt-4 px-1 flex-1 flex flex-col justify-between">
                {/* Title & Location */}
                <div>
                  <h3 className="font-serif text-xl sm:text-[22px] font-medium text-[#083327] tracking-tight leading-snug line-clamp-1">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6e7d75] mt-1">
                    <MapPin className="h-3.5 w-3.5 text-[#6e7d75] shrink-0" />
                    <span className="truncate">{card.location}</span>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mt-4 pt-3 border-t border-black/5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6e7d75]">
                      <Sparkles className="h-3 w-3 text-[#c59e5f] shrink-0" />
                      <span>PROJECT PROGRESS</span>
                    </div>
                    <span className="font-serif text-2xl sm:text-[28px] font-normal text-[#c59e5f] leading-none">
                      {card.progress}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div
                    role="progressbar"
                    aria-valuenow={card.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${card.title} progress ${card.progress}%`}
                    className="w-full h-2 bg-[#f0e8db] rounded-full overflow-hidden mt-2 relative"
                  >
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, card.progress))}%`,
                      }}
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
                    <span className="block font-serif text-sm sm:text-base font-normal text-[#083327] mt-0.5 truncate">
                      {card.currentStage}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-[#7d8b84]">
                      HANDOVER
                    </span>
                    <span className="block font-serif text-sm sm:text-base font-normal text-[#083327] mt-0.5 truncate">
                      {card.handover}
                    </span>
                  </div>
                </div>

                {/* Action Button: VIEW PROGRESS */}
                <div className="mt-5 pt-1">
                  <Link
                    href={`/project-progress/${card.slug || card.propertyId || card.id}`}
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
  );
}

