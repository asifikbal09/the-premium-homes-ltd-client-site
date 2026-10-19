"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export interface MilestoneItem {
  id: string;
  badge: string;
  year: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const MILESTONES: MilestoneItem[] = [
  {
    id: "milestone-01",
    badge: "[01]",
    year: "2023",
    title: "Foundation",
    description: "Started With A Vision To Transform Urban Living",
    image: "/image/life-at-tphl/tplt-team04.png",
    imageAlt: "TPHL corporate meeting and vision presentation",
  },
  {
    id: "milestone-02",
    badge: "[02]",
    year: "2024",
    title: "Smart City Initiative",
    description: "Introduced The Premium Smart City In Ashulia Model Town",
    image: "/image/life-at-tphl/tplt-team03.png",
    imageAlt: "TPHL Smart City Initiative in Ashulia Model Town",
  },
  {
    id: "milestone-03",
    badge: "[03]",
    year: "2025",
    title: "40+ Ongoing Projects",
    description: "Reached Milestone Of 40+ Ongoing Projects",
    image: "/image/life-at-tphl/tplt-team02.png",
    imageAlt: "TPHL 40+ Ongoing Projects Milestone",
  },
  {
    id: "milestone-04",
    badge: "[04]",
    year: "2026",
    title: "52+ Ongoing Projects",
    description: "Reached Milestone Of 52+ Ongoing Projects",
    image: "/image/life-at-tphl/tplt-team1.png",
    imageAlt: "TPHL 52+ Ongoing Projects Milestone",
  },
];

interface MilestoneCardProps {
  item: MilestoneItem;
}

function MilestoneCard({ item }: MilestoneCardProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between pb-8 sm:pb-10 border-b border-[#1f2723]/25 gap-8 lg:gap-12 w-full bg-[#FAF8F5]">
      {/* Left Column: Number badge, Big Year, Title, Subtitle */}
      <div className="flex flex-col justify-between max-w-full lg:max-w-[480px] xl:max-w-[520px] w-full self-stretch">
        {/* Top Row: Year with [badge] aligned to the top-right */}
        <div className="relative flex items-start justify-between w-full">
          <span className="font-heading text-[#044133] text-7xl sm:text-8xl md:text-9xl lg:text-[130px] xl:text-[150px] font-normal leading-none tracking-tight select-none">
            {item.year}
          </span>
          <span className="text-[#1f2723] font-sans text-xs sm:text-sm md:text-base font-normal tracking-wide pt-1 sm:pt-2">
            {item.badge}
          </span>
        </div>

        {/* Bottom Block: Title & Description */}
        <div className="mt-6 sm:mt-8 lg:mt-10">
          <h3 className="font-heading text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-normal text-[#044133] leading-tight tracking-tight">
            {item.title}
          </h3>
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#1f2723] mt-2 sm:mt-2.5 font-normal leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="relative w-full lg:w-[580px] xl:w-[650px] h-[260px] sm:h-[340px] md:h-[380px] lg:h-[430px] shrink-0 overflow-hidden bg-neutral-200">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
          className="object-cover object-[center_30%]"
          priority
        />
      </div>
    </div>
  );
}

export function AboutMilestones() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll progress within this 360vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate active milestone index based on scroll position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const total = MILESTONES.length;
    const step = 1 / total;
    const nextIdx = Math.min(Math.floor(latest / step), total - 1);
    setActiveIndex(Math.max(0, nextIdx));
  });

  return (
    <section
      ref={containerRef}
      aria-label="TPHL Milestones"
      className="relative w-full bg-[#FAF8F5] text-[#1f2723] h-[360vh]"
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="max-w-[1442px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 w-full">
          {/* Stacked Cards Stage */}
          <div className="relative w-full overflow-hidden">
            {/* Base Milestone: 2023 */}
            <div className="relative z-10 w-full">
              <MilestoneCard item={MILESTONES[0]} />
            </div>

            {/* Slide-Up Milestone 1: 2024 */}
            <motion.div
              initial={false}
              animate={{ y: activeIndex >= 1 ? "0%" : "100%" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 w-full shadow-[0_-6px_25px_rgba(0,0,0,0.06)]"
            >
              <MilestoneCard item={MILESTONES[1]} />
            </motion.div>

            {/* Slide-Up Milestone 2: 2025 */}
            <motion.div
              initial={false}
              animate={{ y: activeIndex >= 2 ? "0%" : "100%" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-30 w-full shadow-[0_-6px_25px_rgba(0,0,0,0.06)]"
            >
              <MilestoneCard item={MILESTONES[2]} />
            </motion.div>

            {/* Slide-Up Milestone 3: 2026 */}
            <motion.div
              initial={false}
              animate={{ y: activeIndex >= 3 ? "0%" : "100%" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-40 w-full shadow-[0_-6px_25px_rgba(0,0,0,0.06)]"
            >
              <MilestoneCard item={MILESTONES[3]} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
