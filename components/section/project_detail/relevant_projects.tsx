"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilterChips } from "@/components/ui/filter_chips";
import { HoverShutter } from "@/components/ui/hover_shutter";
import { Heading } from "@/components/ui/primitives";
import type { ProjectData } from "@/lib/projects";
import { cn, SPRING } from "@/lib/utils";

interface RelevantProjectsProps {
  currentProjectId: number;
  priceRange?: string;
  allProjects: ProjectData[];
}

const ALL = "All";
const MAX_FILTERS = 4;
const MAX_CARDS = 2;

const groupOf = (p: ProjectData) =>
  p.community?.name || p.location || "Dhaka, Bangladesh";

function Feature({
  icon,
  inset,
  children,
  uppercase,
}: {
  icon: string;
  inset?: string;
  children: React.ReactNode;
  uppercase?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative size-7 shrink-0 md:size-8">
        <span className="absolute" style={{ inset: inset ?? "0" }}>
          <Image
            src={`/home/icons/${icon}.svg`}
            alt=""
            fill
            className="object-fill"
          />
        </span>
      </span>
      <p
        className={cn(
          "trim whitespace-nowrap text-[14px] leading-none text-sage md:text-[16px]",
          uppercase && "uppercase",
        )}
      >
        {children}
      </p>
    </div>
  );
}

function ShowcaseCard({
  p,
  index,
  play,
  settled,
  armed,
}: {
  p: ProjectData;
  index: number;
  play: boolean;
  settled: boolean;
  armed: boolean;
}) {
  const href = `/projects/${p.slug || p.id}`;
  const blurb = p.hover_text || p.description || "";
  const community = groupOf(p);
  const price = p.price_range || p.price || "Contact for Price";
  const tag = p.tag || "Luxury collection";

  return (
    <motion.article
      layout
      initial={{ opacity: 0.001, y: 28 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0.001, y: 28 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
      transition={{
        ...SPRING,
        delay: settled ? (index % 2) * 0.1 : 0.4 + index * 0.12,
      }}
      className="group flex flex-col gap-6"
    >
      <Link href={href} className="zoom-frame relative block aspect-[700/505]">
        <div className="absolute inset-0">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        {p.image2 && <HoverShutter src={p.image2} armed={armed} />}
        <span className="glass-light absolute left-4 top-4 inline-flex h-10 items-center overflow-hidden rounded-full bg-[rgba(10,30,40,0.14)] px-4 text-[12px] font-medium uppercase tracking-[2px] text-white backdrop-blur-[6px] md:left-6 md:top-6 md:text-[14px]">
          <span className="trim leading-[1.7]">{tag}</span>
        </span>
      </Link>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
          <div className="flex min-w-0 max-w-[464px] flex-col gap-3 md:h-[77px]">
            <h3 className="trim font-display text-[26px] font-normal capitalize leading-[1.5] text-green transition-colors duration-500 md:text-[32px]">
              <Link href={href}>{p.name}</Link>
            </h3>
            {blurb && (
              <div className="trim flex flex-col justify-center md:flex-1">
                <p className="line-clamp-1 text-[16px] leading-[28px] text-sage md:text-[20px]">
                  {blurb}
                </p>
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end sm:gap-4">
            <p className="trim text-[14px] leading-[1.5] tracking-[-0.32px] text-sage sm:text-right md:text-[16px]">
              Starting from
            </p>
            <p className="trim whitespace-nowrap text-[18px] font-medium capitalize leading-[1.5] tracking-[-0.48px] text-sage sm:text-right md:text-[24px]">
              {price}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="relative block h-px w-full overflow-hidden bg-stone-2/40">
            <span className="absolute inset-0 origin-left scale-x-0 bg-green transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
          </span>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {p.size && (
                <Feature
                  icon={index % 2 ? "icon-area-2" : "icon-area"}
                  inset="21.88% 21.68% 21.68% 21.88%"
                >
                  {p.size}
                </Feature>
              )}
              {p.beds ? (
                <Feature
                  icon="icon-bhk"
                  inset="20.04% 19.73% 20.25% 20.08%"
                  uppercase
                >
                  {p.beds} BHK
                </Feature>
              ) : null}
              {p.view && <Feature icon="icon-view">{p.view}</Feature>}
            </div>
            <Feature icon="icon-pin" inset="19.53% 27.8% 19.47% 27.93%">
              {community}
            </Feature>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function RelevantProjects({
  currentProjectId,
  priceRange,
  allProjects,
}: RelevantProjectsProps) {
  const [active, setActive] = useState(ALL);
  const [armed, setArmed] = useState(false);

  // Prefer projects with the same price_range; fall back to other projects if none match
  const relevant = useMemo(() => {
    const others = allProjects.filter((p) => p.id !== currentProjectId);
    const samePrice = priceRange
      ? others.filter((p) => p.price_range === priceRange)
      : [];
    return samePrice.length > 0 ? samePrice : others;
  }, [allProjects, currentProjectId, priceRange]);

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    relevant.forEach((p) => {
      const g = groupOf(p);
      if (g) counts.set(g, (counts.get(g) ?? 0) + 1);
    });
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_FILTERS)
      .map(([name]) => name);
    return [ALL, ...top];
  }, [relevant]);

  const shown = useMemo(
    () =>
      relevant
        .filter((p) => active === ALL || groupOf(p) === active)
        .slice(0, MAX_CARDS),
    [relevant, active],
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, {
    once: true,
    margin: "0px 0px -12% 0px",
  });
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!gridInView) return;
    const t = setTimeout(() => setSettled(true), 1600);
    return () => clearTimeout(t);
  }, [gridInView]);

  if (relevant.length === 0) {
    return null;
  }

  return (
    <section
      onPointerEnter={(e) => e.pointerType === "mouse" && setArmed(true)}
      aria-label="Relevant Projects"
      className="bg-white py-[clamp(56px,6.25vw,100px)]"
    >
      <div className="shell flex flex-col items-center">
        {/* Figma Heading */}
        <Heading size={64} min={36} leading={1.1} mask className="text-center">
          Relevant Project
        </Heading>

        {/* Filter Chips */}
        {filters.length > 1 && (
          <div className="no-scrollbar -mx-[clamp(16px,5vw,80px)] mt-10 w-[calc(100%+2*clamp(16px,5vw,80px))] overflow-x-auto md:mt-12">
            <FilterChips
              options={filters}
              value={active}
              onChange={setActive}
              className="mx-auto w-max px-[clamp(16px,5vw,80px)]"
            />
          </div>
        )}

        {/* 2-Column Showcase Grid */}
        <motion.div
          ref={gridRef}
          layout
          className="mt-12 grid w-full grid-cols-1 gap-x-10 gap-y-12 md:mt-20 lg:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ShowcaseCard
                key={p.id}
                p={p}
                index={i}
                play={gridInView}
                settled={settled}
                armed={armed}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
