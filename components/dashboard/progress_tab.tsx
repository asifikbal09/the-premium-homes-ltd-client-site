"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, CircleDot, Clock, Camera } from "lucide-react";

export function ProgressTab() {
  const milestones = [
    { title: "Soil Test & Piling Work", status: "completed", date: "May 2024", pct: 100 },
    { title: "Basement 1 & 2 Concrete Foundation", status: "completed", date: "Nov 2024", pct: 100 },
    { title: "Ground to 8th Floor Structure", status: "completed", date: "Dec 2025", pct: 100 },
    { title: "10th Slab Casting & Upper Framework", status: "completed", date: "Feb 2026", pct: 100 },
    { title: "Interior Masonry & Partition Walls", status: "in_progress", date: "Current (65%)", pct: 65 },
    { title: "MEP Rough-in & Lift Installation", status: "upcoming", date: "Estimated Aug 2026", pct: 0 },
    { title: "Exterior Architectural Cladding & Glazing", status: "upcoming", date: "Estimated Jan 2027", pct: 0 },
    { title: "Final Finishing & Key Handover", status: "upcoming", date: "Estimated Dec 2027", pct: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Construction & Handover Tracker
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Detailed real-time engineering milestones for The Premium Green Valley (Unit 8B).
        </p>
      </div>

      {/* Progress Metric Banner */}
      <div className="bg-gradient-to-r from-[#044133] to-[#085a47] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-bold tracking-widest text-[#f7e7cb] uppercase">
            Current Phase: Superstructure & Masonry
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold">
            The Premium Green Valley — 72% Overall Completed
          </h2>
          <p className="text-xs text-stone-200/90 leading-relaxed">
            All structural inspections have passed Bangladesh National Building Code (BNBC) and earthquake resilience audits.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center min-w-[140px] shrink-0">
          <span className="text-3xl font-bold text-[#f7e7cb] block">72%</span>
          <span className="text-[11px] uppercase tracking-wider text-white/80 block mt-0.5">
            Static Track
          </span>
        </div>
      </div>

      {/* Milestone Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#044133]">
            Milestone Timeline
          </h3>

          <div className="relative border-l-2 border-stone-200 ml-4 space-y-6 pl-6 pt-1">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative group">
                <span
                  className={`absolute -left-[33px] top-0 w-4 h-4 rounded-full border-2 bg-white ${
                    item.status === "completed"
                      ? "border-emerald-600 bg-emerald-600"
                      : item.status === "in_progress"
                      ? "border-amber-500 bg-amber-500 animate-pulse"
                      : "border-stone-300 bg-white"
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-semibold text-sm text-stone-900">
                    {item.title}
                  </h4>
                  <span className="text-xs font-mono text-stone-400">
                    {item.date}
                  </span>
                </div>
                {item.status === "in_progress" && (
                  <div className="mt-2 w-full max-w-md h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Site Progress Photos */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#044133]">
              Recent Site Photos
            </h3>
            <span className="text-xs text-stone-400 font-mono">Feb 2026</span>
          </div>

          <div className="space-y-3">
            <div className="relative h-36 rounded-xl overflow-hidden bg-stone-100 border border-stone-100">
              <Image
                src="/image/progress/tph_green_valley.png"
                alt="Green Valley Elevation"
                fill
                sizes="300px"
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md">
                10th Floor Slab Casting
              </span>
            </div>

            <div className="relative h-36 rounded-xl overflow-hidden bg-stone-100 border border-stone-100">
              <Image
                src="/image/progress/Lobby.png"
                alt="Lobby Area Construction"
                fill
                sizes="300px"
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md">
                Grand Lobby Framework
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
