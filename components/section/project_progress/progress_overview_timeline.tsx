"use client";

import React from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineMilestone {
  id: string;
  title: string;
  status: "COMPLETED" | "IN PROGRESS" | "UPCOMING";
  date: string;
}

const DEFAULT_MILESTONES: TimelineMilestone[] = [
  {
    id: "1",
    title: "Foundation",
    status: "COMPLETED",
    date: "Jan 2025",
  },
  {
    id: "2",
    title: "Structure",
    status: "COMPLETED",
    date: "Mar 2025",
  },
  {
    id: "3",
    title: "Brick & Plaster",
    status: "IN PROGRESS",
    date: "Jun 2026",
  },
  {
    id: "4",
    title: "Interior & Finishing",
    status: "UPCOMING",
    date: "Oct 2026",
  },
  {
    id: "5",
    title: "Handover",
    status: "UPCOMING",
    date: "Dec 2027",
  },
];

interface ProgressOverviewTimelineProps {
  overviewText?: string;
  milestones?: TimelineMilestone[];
}

export function ProgressOverviewTimeline({
  overviewText = "TPH Green Valley is designed to offer a perfect balance of modern architecture, green space and world class amenities. Every detail of this project is crafted to create a community where life feels better every day.",
  milestones = DEFAULT_MILESTONES,
}: ProgressOverviewTimelineProps) {
  return (
    <section
      aria-label="Project Overview and Timeline"
      className="w-full bg-[#fbf9f5] py-16 sm:py-20 md:py-24 border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#083327] tracking-tight">
          Project Overview
        </h2>

        {/* Overview Description */}
        <p className="font-sans text-xs sm:text-sm md:text-base text-[#4a5851] max-w-4xl mt-3 sm:mt-4 leading-relaxed font-light">
          {overviewText}
        </p>

        {/* Milestone Stepper Timeline */}
        <div className="mt-12 sm:mt-16 md:mt-20 overflow-x-auto pb-4 scrollbar-none">
          <div className="min-w-[680px] lg:min-w-0 px-4">
            <div className="relative flex items-center justify-between">
              {/* Connecting Background Line */}
              <div
                className="absolute top-4 left-6 right-6 h-0.5 -translate-y-1/2 z-0"
                style={{
                  background:
                    "linear-gradient(to right, #083327 0%, #083327 30%, #c59e5f 50%, #e0ded9 60%, #e0ded9 100%)",
                }}
              />

              {/* Milestones */}
              {milestones.map((milestone) => {
                const isCompleted = milestone.status === "COMPLETED";
                const isInProgress = milestone.status === "IN PROGRESS";
                const isUpcoming = milestone.status === "UPCOMING";

                return (
                  <div
                    key={milestone.id}
                    className="relative z-10 flex flex-col items-center text-center group"
                  >
                    {/* Circle Node */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs",
                        isCompleted && "bg-[#188864] text-white",
                        isInProgress && "bg-[#c59e5f] text-white ring-4 ring-[#c59e5f]/25",
                        isUpcoming && "bg-[#e5e1d8] text-[#858f89]"
                      )}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[2.5]" />}
                      {isInProgress && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                      )}
                      {isUpcoming && <Lock className="w-3.5 h-3.5 stroke-[2]" />}
                    </div>

                    {/* Milestone Information */}
                    <div className="mt-3.5 flex flex-col items-center">
                      <span className="font-heading text-sm sm:text-base font-normal text-[#083327]">
                        {milestone.title}
                      </span>

                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-[0.14em] mt-0.5",
                          isCompleted && "text-[#5a6a62]",
                          isInProgress && "text-[#c59e5f]",
                          isUpcoming && "text-[#858f89]"
                        )}
                      >
                        {milestone.status}
                      </span>

                      <span className="text-xs text-[#7d8b84] font-light mt-0.5">
                        {milestone.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
