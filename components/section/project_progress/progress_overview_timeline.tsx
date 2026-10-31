"use client";

import { motion, useInView } from "motion/react";
import React, { useRef } from "react";
import { Appear } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn, SETTLE } from "@/lib/utils";

export interface TimelineMilestone {
  id: string;
  title: string;
  status: "COMPLETED" | "IN PROGRESS" | "UPCOMING";
  date: string;
}

interface ProgressOverviewTimelineProps {
  overviewText?: string;
  milestones?: TimelineMilestone[];
  workCategoryProgress?: Record<string, string | undefined>;
  constructionStart?: string;
  expectedHandover?: string;
  projectName?: string;
}

function parsePct(val?: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : Math.round(num);
}

function getStatusFromPct(
  pct: number,
): "COMPLETED" | "IN PROGRESS" | "UPCOMING" {
  if (pct >= 100) return "COMPLETED";
  if (pct > 0) return "IN PROGRESS";
  return "UPCOMING";
}

const DEFAULT_MILESTONES: TimelineMilestone[] = [
  {
    id: "foundation",
    title: "Foundation",
    status: "COMPLETED",
    date: "Jan 2025",
  },
  {
    id: "structure",
    title: "Structure",
    status: "COMPLETED",
    date: "Mar 2025",
  },
  {
    id: "brick-plaster",
    title: "Brick & Plaster",
    status: "IN PROGRESS",
    date: "Jun 2026",
  },
  {
    id: "interior-finishing",
    title: "Interior & Finishing",
    status: "UPCOMING",
    date: "Oct 2026",
  },
  {
    id: "handover",
    title: "Handover",
    status: "UPCOMING",
    date: "Dec 2027",
  },
];

export function ProgressOverviewTimeline({
  overviewText,
  milestones,
  workCategoryProgress,
  constructionStart,
  expectedHandover,
  projectName = "TPH Green Valley",
}: ProgressOverviewTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(timelineRef, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const resolvedOverviewText =
    overviewText ||
    `${projectName} is designed to offer a perfect balance of modern architecture, green space and world-class amenities. Every detail of this project is crafted to create a community where life feels better every day.`;

  const dynamicMilestones: TimelineMilestone[] = React.useMemo(() => {
    if (milestones && milestones.length > 0) return milestones;

    if (workCategoryProgress) {
      const struct = parsePct(workCategoryProgress.structural_work);
      const brick = parsePct(workCategoryProgress.brick_work);
      const plaster = parsePct(workCategoryProgress.plaster_work);
      const elec = parsePct(workCategoryProgress.electrical_work);
      const plumb = parsePct(workCategoryProgress.plumbing_work);
      const tiles = parsePct(workCategoryProgress.tiles_work);
      const paint = parsePct(workCategoryProgress.paint_work);

      const foundationPct = struct > 0 ? 100 : 0;
      const brickPlaster = Math.round(Math.max(brick, plaster, (brick + plaster) / 2));
      const interiorFinishing = Math.round(
        Math.max(tiles, paint, (elec + plumb + tiles + paint) / 4),
      );

      return [
        {
          id: "foundation",
          title: "Foundation",
          status: getStatusFromPct(foundationPct),
          date:
            foundationPct >= 100
              ? constructionStart || "Completed"
              : foundationPct > 0
                ? `${foundationPct}%`
                : constructionStart || "Phase 1",
        },
        {
          id: "structure",
          title: "Structure",
          status: getStatusFromPct(struct),
          date: struct > 0 ? `${struct}%` : "Phase 2",
        },
        {
          id: "brick-plaster",
          title: "Brick & Plaster",
          status: getStatusFromPct(brickPlaster),
          date: brickPlaster > 0 ? `${brickPlaster}%` : "Phase 3",
        },
        {
          id: "interior-finishing",
          title: "Interior & Finishing",
          status: getStatusFromPct(interiorFinishing),
          date: interiorFinishing > 0 ? `${interiorFinishing}%` : "Phase 4",
        },
        {
          id: "handover",
          title: "Handover",
          status: paint >= 100 ? "COMPLETED" : "UPCOMING",
          date: expectedHandover || "Scheduled",
        },
      ];
    }

    return DEFAULT_MILESTONES;
  }, [milestones, workCategoryProgress, constructionStart, expectedHandover]);

  // Compute how far along the horizontal line the active progress bar should extend
  const activeLineFraction = React.useMemo(() => {
    if (dynamicMilestones.length <= 1) return 0;
    let lastActiveIdx = 0;
    dynamicMilestones.forEach((m, idx) => {
      if (m.status === "COMPLETED" || m.status === "IN PROGRESS") {
        lastActiveIdx = idx;
      }
    });
    return (lastActiveIdx / (dynamicMilestones.length - 1)) * 100;
  }, [dynamicMilestones]);

  return (
    <section
      aria-label="Project Overview and Timeline"
      className="w-full bg-white pb-8 pt-[clamp(56px,5vw,80px)]"
    >
      <div className="shell flex flex-col gap-[56px]">
        {/* Section Header & Overview Paragraph (Figma 8036:25002) */}
        <div className="flex flex-col items-start gap-[24px]">
          <div className="max-w-[714px]">
            <Heading size={64} min={36} leading={1.1} mask className="text-[#054b3c]">
              Project Overview
            </Heading>
          </div>

          <Appear preset="lift" delay={0.16}>
            <p className="max-w-[925px] font-sans text-[16px] font-normal leading-[1.5] text-[#546360] sm:text-[18px]">
              {resolvedOverviewText}
            </p>
          </Appear>
        </div>

        {/* 5-Step Horizontal Milestone Stepper (Figma 8036:25007) */}
        <div
          ref={timelineRef}
          className="scrollbar-none -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          <div className="relative min-w-[720px] lg:min-w-0">
            {/* Base Gray Connecting Track (2px height at vertical center of 56px circles = 28px) */}
            <div
              aria-hidden
              className="absolute left-[44px] right-[44px] top-[28px] h-[2px] -translate-y-1/2 bg-[#e5e5e5]"
            />

            {/* Animated Dark Progress Connecting Track */}
            <div
              aria-hidden
              className="absolute left-[44px] right-[44px] top-[28px] h-[2px] -translate-y-1/2 overflow-hidden"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: inView ? `${activeLineFraction}%` : "0%" }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 1.4, ease: SETTLE, delay: 0.25 }
                }
                className="h-full bg-[#09221c]"
              />
            </div>

            {/* Milestone Nodes */}
            <div className="relative z-10 flex items-start justify-between">
              {dynamicMilestones.map((milestone, idx) => {
                const isCompleted = milestone.status === "COMPLETED";
                const isInProgress = milestone.status === "IN PROGRESS";

                return (
                  <Appear
                    key={milestone.id}
                    preset="lift"
                    delay={0.12 + idx * 0.08}
                    className="flex flex-col items-center gap-[24px] text-center"
                  >
                    {/* 56×56 Figma Status Circle */}
                    <div className="relative flex size-[56px] shrink-0 items-center justify-center">
                      {isCompleted ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src="/image/progress/icons/milestone-completed.svg"
                          alt="Completed"
                          width={56}
                          height={56}
                          className="size-[56px]"
                        />
                      ) : isInProgress ? (
                        <div className="relative flex size-[56px] items-center justify-center">
                          <span
                            aria-hidden
                            className="absolute inset-0 animate-ping rounded-full bg-[#cfa564]/20"
                            style={{ animationDuration: "2.6s" }}
                          />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/image/progress/icons/milestone-in-progress.svg"
                            alt="In Progress"
                            width={63}
                            height={63}
                            className="size-[56px] -rotate-90"
                          />
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src="/image/progress/icons/milestone-upcoming.svg"
                          alt="Upcoming"
                          width={65}
                          height={65}
                          className="size-[56px]"
                        />
                      )}
                    </div>

                    {/* Milestone Label, Status, Date (Figma 8036:25017) */}
                    <div className="flex flex-col items-center justify-center gap-[11px] whitespace-nowrap leading-[1.2]">
                      <p className="trim font-display text-[18px] font-medium text-black">
                        {milestone.title}
                      </p>
                      <p
                        className={cn(
                          "trim font-sans text-[14px] font-normal uppercase",
                          isInProgress ? "text-[#cfa564]" : "text-black/50",
                        )}
                      >
                        {milestone.status}
                      </p>
                      <p className="trim font-sans text-[14px] font-normal text-black/50">
                        {milestone.date}
                      </p>
                    </div>
                  </Appear>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
