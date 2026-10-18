"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ChevronRight,
  Heart,
  Landmark,
  CreditCard,
  Layers,
  Building2,
  FolderOpen,
} from "lucide-react";
import { ClientUser, ClientFlat } from "./types";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  user: ClientUser | null;
  myFlats?: ClientFlat[];
  isLoading?: boolean;
  onViewAllFlats?: () => void;
  onViewAllProjects?: () => void;
  onSelectProject?: (project: ClientFlat) => void;
}

interface OngoingProjectItem {
  id: number | string;
  name: string;
  slug?: string;
  location?: string;
  image: string;
  status?: string;
  price?: string;
}

export function OverviewTab({
  user,
  myFlats,
  isLoading = false,
  onViewAllFlats,
  onViewAllProjects,
  onSelectProject,
}: OverviewTabProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProjectItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch real ongoing projects from API
  useEffect(() => {
    let isMounted = true;
    async function loadOngoingProjects() {
      try {
        setIsLoadingProjects(true);
        const baseUrl = (
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.dpremiumhomes.com/api"
        ).replace(/\/+$/, "");

        const res = await fetch(`${baseUrl}/projects`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json)
            ? json
            : json?.projects || json?.data || [];

          if (isMounted && Array.isArray(list)) {
            const mapped = list.slice(0, 4).map((p: any) => ({
              id: p.id,
              name: p.name || p.title || "The Premium Development",
              slug: p.slug || "projects",
              location:
                typeof p.location === "string" && p.location.trim()
                  ? p.location
                  : p.community?.name || "Dhaka, Bangladesh",
              image:
                p.image ||
                p.featured_image ||
                "/image/progress/tph_green_valley.png",
              status: p.status || "Under Construction",
              price: p.price ? `From ৳${p.price}` : "Price On Request",
            }));
            setOngoingProjects(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading real ongoing projects:", err);
      } finally {
        if (isMounted) setIsLoadingProjects(false);
      }
    }

    loadOngoingProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = (id: string | number) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const displayName =
    user?.name ||
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "";

  // Financial figures strictly from user
  const totalPaid = user?.total_paid || "৳ 0";
  const outstanding = user?.outstanding || "৳ 0";
  const totalExpense = user?.total_expense || "৳ 0";

  // Dynamic completion percentage calculation
  const completionPct = user?.completion !== undefined ? user.completion : 0;

  // Flats strictly from user
  const displayedFlats = myFlats || [];

  // Donut SVG circumference calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * Math.min(100, Math.max(0, completionPct))) / 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. WELCOME HEADER                                         */}
      {/* ========================================================= */}
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Overviews
        </h1>
        {isLoading ? (
          <div className="h-4 w-48 bg-stone-200/80 rounded animate-pulse mt-2" />
        ) : (
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Welcome back{displayName ? `, ${displayName}!` : "!"}
          </p>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. FOUR TOP METRIC CARDS (With Skeletons)                 */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Paid */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#044133] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-stone-500 font-medium block">
              Total Paid
            </span>
            {isLoading ? (
              <div className="h-6 w-28 bg-stone-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
                {totalPaid}
              </span>
            )}
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Paid to date
            </span>
          </div>
        </div>

        {/* Card 2: Outstanding */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-stone-500 font-medium block">
              Outstanding
            </span>
            {isLoading ? (
              <div className="h-6 w-28 bg-stone-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
                {outstanding}
              </span>
            )}
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Remaining Due
            </span>
          </div>
        </div>

        {/* Card 3: Total Expense */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#d97706] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-stone-500 font-medium block">
              Total Expense
            </span>
            {isLoading ? (
              <div className="h-6 w-28 bg-stone-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
                {totalExpense}
              </span>
            )}
            <span className="text-[11px] text-stone-400 block mt-0.5">
              All Project Expense
            </span>
          </div>
        </div>

        {/* Card 4: Completion */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            {isLoading ? (
              <div className="w-12 h-12 rounded-full bg-stone-200 animate-pulse" />
            ) : (
              <>
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 52 52">
                  <circle
                    cx="26"
                    cy="26"
                    r={radius}
                    className="stroke-stone-100"
                    strokeWidth="4.5"
                    fill="transparent"
                  />
                  <circle
                    cx="26"
                    cy="26"
                    r={radius}
                    className="stroke-[#044133]"
                    strokeWidth="4.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-stone-900">
                  {completionPct}%
                </span>
              </>
            )}
          </div>
          <div className="flex-1">
            <span className="text-lg sm:text-xl font-bold text-stone-900 block leading-tight">
              Completion
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Overall Progress
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MY FLATS SECTION                                       */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133]">
            My Flats
          </h2>
          {displayedFlats.length > 0 && (
            <button
              type="button"
              onClick={onViewAllFlats}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-bold tracking-wider text-stone-700 uppercase transition-all shadow-xs cursor-pointer"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Skeleton Loading for My Flats */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={`my-flats-skeleton-${n}`}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col"
              >
                <div className="h-[185px] w-full bg-stone-200 animate-pulse" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-stone-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-stone-100 rounded animate-pulse" />
                  <div className="h-12 w-full bg-stone-100 rounded-xl animate-pulse" />
                  <div className="h-2 w-full bg-stone-100 rounded-full animate-pulse" />
                  <div className="h-4 w-1/3 bg-stone-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedFlats.length === 0 ? (
          /* Empty State when User has no Flats */
          <div className="bg-white rounded-2xl p-10 sm:p-12 border border-stone-200/80 text-center flex flex-col items-center justify-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
              No Registered Properties Found
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-md leading-relaxed">
              You currently do not have any registered apartments or suites in your account.
              Explore our luxury residential & commercial developments to get started.
            </p>
            <div className="mt-5">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#044133] hover:bg-[#065442] text-[#f7e7cb] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
              >
                <span>EXPLORE DEVELOPMENTS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedFlats.map((flat, idx) => (
              <div
                key={`${flat.id}-${idx}`}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Flat Image & Badge */}
                <div className="relative h-[180px] sm:h-[190px] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={flat.image || "/image/progress/tph_green_valley.png"}
                    alt={flat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
                    {flat.status && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fef5e7] text-[#b45309] text-[10.5px] font-semibold tracking-wide border border-[#fef08a]/60 shadow-xs">
                        {flat.status}
                      </span>
                    )}
                    {flat.flatNo && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 text-[10.5px] font-semibold border border-white/60 shadow-xs">
                        Unit {flat.flatNo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Flat Body Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[15px] sm:text-base text-stone-900 group-hover:text-[#044133] transition-colors leading-snug">
                        {flat.title}
                      </h3>
                      {flat.flatSize && (
                        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded shrink-0">
                          {flat.flatSize}
                        </span>
                      )}
                    </div>
                    {flat.location && (
                      <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{flat.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Partial Payment and Due Payment stats */}
                  {(flat.partial_payment || flat.due_payment) && (
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px]">
                      {flat.partial_payment && (
                        <div>
                          <span className="text-stone-400 block text-[10px] font-medium">PAID</span>
                          <span className="font-bold text-emerald-800">৳ {flat.partial_payment}</span>
                        </div>
                      )}
                      {flat.due_payment && (
                        <div className="text-right">
                          <span className="text-stone-400 block text-[10px] font-medium">REMAINING DUE</span>
                          <span className="font-bold text-red-600">৳ {flat.due_payment}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Price & View Project CTA */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">TOTAL VALUE</span>
                      <span className="text-xs sm:text-sm font-bold text-stone-900">
                        {flat.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectProject?.(flat)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#044133] hover:underline cursor-pointer"
                    >
                      <span>View Project</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 4. ONGOING PROJECTS SECTION (Real Dynamic Data)           */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133]">
            Ongoing Projects
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-bold tracking-wider text-stone-700 uppercase transition-all shadow-xs cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Skeleton Loading for Ongoing Projects */}
        {isLoadingProjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={`ongoing-proj-skeleton-${n}`}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col"
              >
                <div className="h-[160px] w-full bg-stone-200 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-stone-100 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-stone-200 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : ongoingProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-stone-200/80 text-center text-stone-500">
            <p className="text-sm font-medium">No ongoing projects available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {ongoingProjects.map((project, idx) => {
              const isFav = !!favorites[project.id];

              return (
                <div
                  key={`${project.id}-${idx}`}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Project Image, Badge & Favorite Button */}
                  <div className="relative h-[160px] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.status && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 text-[10.5px] font-semibold border border-white/60 shadow-xs">
                        {project.status}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(project.id)}
                      aria-label="Add to favorites"
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-white transition-all shadow-xs cursor-pointer"
                    >
                      <Heart
                        className={cn(
                          "w-3.5 h-3.5 transition-colors",
                          isFav ? "fill-red-500 text-red-500" : "text-stone-600"
                        )}
                      />
                    </button>
                  </div>

                  {/* Project Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 group-hover:text-[#044133] transition-colors leading-snug line-clamp-1">
                        {project.name}
                      </h3>
                      {project.location && (
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">
                        {project.price}
                      </span>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#044133] hover:underline cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
