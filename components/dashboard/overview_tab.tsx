"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ChevronRight,
  Heart,
  Landmark,
  CreditCard,
  Layers,
} from "lucide-react";
import { ClientUser, ClientFlat } from "./types";
import { DEFAULT_FLATS, DEFAULT_ONGOING_PROJECTS } from "./dashboard_data";

interface OverviewTabProps {
  user: ClientUser | null;
  myFlats?: ClientFlat[];
  isLoading?: boolean;
  onViewAllFlats?: () => void;
  onViewAllProjects?: () => void;
  onSelectProject?: (project: ClientFlat) => void;
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
    "Afsar Hossen";

  // Financial figures: use dynamic if provided by login auth response, else fallback to design numbers
  const totalPaid = user?.total_paid || "৳ 42,20,000";
  const outstanding = user?.outstanding || "৳ 3,56,000";
  const totalExpense = user?.total_expense || "৳ 50,78,000";

  // Static completion data per user instruction: "maybe we dont have the comlatation data so make it static"
  const staticCompletion = 70;

  // Saved properties flats strictly displayed for My Flats
  const displayedFlats = myFlats !== undefined ? myFlats : DEFAULT_FLATS;

  // Donut SVG circumference calculation for 70%
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * staticCompletion) / 100;

  return (
    <div className="space-y-8">
      {/* ========================================================= */}
      {/* 1. WELCOME HEADER                                         */}
      {/* ========================================================= */}
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Overviews
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Welcome back, {displayName}!
        </p>
      </div>

      {/* ========================================================= */}
      {/* 2. FOUR TOP METRIC CARDS                                  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Paid */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#044133] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">
              Total Paid
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
              {totalPaid}
            </span>
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
          <div>
            <span className="text-xs text-stone-500 font-medium block">
              Outstanding
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
              {outstanding}
            </span>
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
          <div>
            <span className="text-xs text-stone-500 font-medium block">
              Total Expense
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
              {totalExpense}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              All Project Expense
            </span>
          </div>
        </div>

        {/* Card 4: Completion (Static 70% as requested) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
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
              {staticCompletion}%
            </span>
          </div>
          <div>
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
          <button
            type="button"
            onClick={onViewAllFlats}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-bold tracking-wider text-stone-700 uppercase transition-all shadow-xs cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayedFlats.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-stone-200/80 text-center text-stone-500">
            <p className="text-sm font-medium">No saved properties found in your onboard account.</p>
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
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fef5e7] text-[#b45309] text-[10.5px] font-semibold tracking-wide border border-[#fef08a]/60 shadow-xs">
                      {flat.status}
                    </span>
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
                    <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{flat.location}</span>
                    </div>
                  </div>

                  {/* Partial Payment and Due Payment stats from savedProperties */}
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

                  {/* Construction Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <div>
                        <span className="text-stone-400 font-semibold tracking-wider uppercase">
                          CONSTRUCTION
                        </span>
                        <p className="text-stone-800 font-semibold text-xs mt-0.5">
                          {flat.construction_pct}% complete
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-400 font-semibold tracking-wider uppercase">
                          HANDOVER
                        </span>
                        <p className="text-stone-800 font-semibold text-xs mt-0.5">
                          {flat.handover_date}
                        </p>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#d97706] rounded-full transition-all duration-500"
                        style={{ width: `${flat.construction_pct}%` }}
                      />
                    </div>
                  </div>

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
      {/* 4. ONGOING PROJECTS SECTION                               */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133]">
            Ongoing Projects
          </h2>
          <button
            type="button"
            onClick={onViewAllProjects}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-bold tracking-wider text-stone-700 uppercase transition-all shadow-xs cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {DEFAULT_ONGOING_PROJECTS.map((project, idx) => {
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
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fef5e7] text-[#b45309] text-[10px] font-semibold tracking-wide border border-[#fef08a]/60 shadow-xs">
                      {project.status}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(project.id)}
                    aria-label="Add to favorites"
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 shadow-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isFav
                          ? "fill-red-500 text-red-500"
                          : "text-stone-600 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Project Body Info */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#044133] transition-colors leading-snug truncate">
                      {project.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  </div>

                  {/* Mini Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span>Progress</span>
                      <span className="font-semibold text-stone-800">
                        {project.construction_pct}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#044133] rounded-full"
                        style={{ width: `${project.construction_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-900">
                      {project.price}
                    </span>
                    <Link
                      href={`/projects`}
                      className="font-semibold text-[#044133] hover:underline flex items-center gap-0.5"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
