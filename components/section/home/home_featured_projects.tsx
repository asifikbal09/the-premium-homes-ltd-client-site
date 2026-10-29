"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Appear } from "@/components/ui/motion";
import { HoverShutter } from "@/components/ui/hover_shutter";
import { Eyebrow, GreenPill, Heading } from "@/components/ui/primitives";
import type { ProjectData } from "@/lib/projects";
import { cn, SPRING } from "@/lib/utils";

const ALL = "All";
const MAX_FILTERS = 4;
const MAX_CARDS = 4;

type Project = {
  id: string | number;
  name: string;
  community: string;
  price: string;
  tag: string;
  blurb: string;
  beds?: number;
  size?: string;
  view?: string;
  image: string;
  /** Second photo, opened over the first with a shutter on hover. */
  hover?: string;
  crop?: React.CSSProperties;
  href: string;
};

// Shown only when the projects API returns nothing.
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "prestige-heritage",
    name: "Prestige Heritage",
    community: "Ashulia Model Town",
    price: "90lac - 2Cr BDT",
    tag: "Luxury collection",
    blurb: "Sustainable living in Dhaka's most popular area.",
    view: "Garden view",
    image: "/home/img/project-prestige.jpg",
    hover: "/home/video/spotlight-living.jpg",
    crop: { left: "-0.74%", top: "-0.73%", width: "101.43%", height: "104.47%" },
    href: "/projects",
  },
  {
    id: "studio-suite",
    name: "Studio Suite 4.0",
    community: "Bashundhara R/A",
    price: "90lac - 2Cr BDT",
    tag: "Luxury collection",
    blurb: "Sustainable living in Dhaka's most popular area.",
    image: "/home/img/project-studio.jpg",
    hover: "/home/img/living.png",
    crop: { left: "0%", top: "-3.52%", width: "102.53%", height: "117.35%" },
    href: "/projects",
  },
];

function toCards(projects: ProjectData[]): Project[] {
  if (projects.length === 0) return FALLBACK_PROJECTS;
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    community: p.location || "Dhaka, Bangladesh",
    price: p.price_range || p.price || "Contact for Price",
    tag: p.tag || "Luxury collection",
    blurb: p.hover_text || p.description || "",
    beds: p.beds,
    size: p.size,
    view: p.view,
    image: p.image,
    hover: p.image2,
    href: `/projects/${p.slug || p.id}`,
  }));
}

/** "All" plus the locations with the most projects. */
function toFilters(cards: Project[]): string[] {
  const counts = new Map<string, number>();
  cards.forEach((c) => counts.set(c.community, (counts.get(c.community) ?? 0) + 1));
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_FILTERS)
    .map(([name]) => name);
  return [ALL, ...top];
}

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
      <span className="relative size-8 shrink-0 md:size-9">
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
          "trim whitespace-nowrap text-[15px] leading-none text-sage md:text-[18px]",
          uppercase && "uppercase",
        )}
      >
        {children}
      </p>
    </div>
  );
}

/**
 * Card fades up gently once the grid is in view, each a beat after the last and
 * after the filter chips. Cards mounted by a filter change enter with a short stagger.
 */
function ProjectCard({
  p,
  index,
  play,
  settled,
  armed,
}: {
  p: Project;
  index: number;
  play: boolean;
  settled: boolean;
  armed: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0.001, y: 28 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0.001, y: 28 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
      transition={{
        ...SPRING,
        delay: settled ? (index % 2) * 0.1 : 0.7 + index * 0.12,
      }}
      className="group flex flex-col gap-6"
    >
      <Link href={p.href} className="zoom-frame relative block aspect-[700/505]">
        <div className="absolute inset-0">
          <div className="absolute" style={p.crop ?? { inset: 0 }}>
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        {p.hover && <HoverShutter src={p.hover} armed={armed} />}
        <span className="glass-light absolute left-4 top-4 inline-flex h-10 items-center overflow-hidden rounded-full bg-[rgba(10,30,40,0.14)] px-4 text-[12px] font-medium uppercase tracking-[2px] text-white backdrop-blur-[6px] md:left-6 md:top-6 md:text-[14px]">
          <span className="trim leading-[1.7]">{p.tag}</span>
        </span>
      </Link>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
          <div className="flex min-w-0 max-w-[464px] flex-col gap-3 md:h-[77px]">
            <h3
              className={cn(
                "trim font-display text-[26px] font-normal capitalize leading-[1.5] transition-colors duration-500 group-hover:text-green md:text-[32px]",
                // Figma rests the second row of cards in sage; they turn green on hover.
                index >= 2 ? "text-sage" : "text-green",
              )}
            >
              <Link href={p.href}>{p.name}</Link>
            </h3>
            {p.blurb && (
              <div className="trim flex flex-col justify-center md:flex-1">
                <p className="line-clamp-1 text-[16px] leading-[28px] text-sage md:text-[20px]">
                  {p.blurb}
                </p>
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end sm:gap-4">
            <p className="trim text-[14px] leading-[1.5] tracking-[-0.32px] text-sage sm:text-right md:text-[16px]">
              Starting from
            </p>
            <p className="trim whitespace-nowrap text-[18px] sm:text-right font-medium capitalize leading-[1.5] tracking-[-0.48px] text-sage md:text-[24px]">
              {p.price}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="relative block h-px w-full overflow-hidden bg-stone-2/40">
            <span className="absolute inset-0 origin-left scale-x-0 bg-green transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
          </span>
          <div className="flex flex-wrap items-center justify-between gap-x-7 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
              {p.beds ? (
                <Feature
                  icon="icon-bhk"
                  inset="20.04% 19.73% 20.25% 20.08%"
                  uppercase
                >
                  {p.beds} BHK
                </Feature>
              ) : null}
              {p.size && (
                <Feature
                  icon={index % 2 ? "icon-area-2" : "icon-area"}
                  inset="21.88% 21.68% 21.68% 21.88%"
                >
                  {p.size}
                </Feature>
              )}
              {p.view && <Feature icon="icon-view">{p.view}</Feature>}
            </div>
            <Feature icon="icon-pin" inset="19.53% 27.8% 19.47% 27.93%">
              {p.community}
            </Feature>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function HomeFeaturedProjects({ initialProjects = [] }: { initialProjects?: ProjectData[] }) {
  const cards = useMemo(() => toCards(initialProjects), [initialProjects]);
  const filters = useMemo(() => toFilters(cards), [cards]);
  const [filter, setFilter] = useState(ALL);
  // Hover photos mount the first time a pointer enters the section (never on touch screens).
  const [armed, setArmed] = useState(false);
  const [hoveredChip, setHoveredChip] = useState<string | null>(null);
  const visible = cards
    .filter((p) => filter === ALL || p.community === filter)
    .slice(0, MAX_CARDS);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, {
    once: true,
    margin: "0px 0px -12% 0px",
  });
  // Once the first reveal has played, later entries (filter changes) skip the long lead-in.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!gridInView) return;
    const t = setTimeout(() => setSettled(true), 1800);
    return () => clearTimeout(t);
  }, [gridInView]);

  return (
    <section
      onPointerEnter={(e) => e.pointerType === "mouse" && setArmed(true)}
      id="projects"
      className="bg-white pb-16 pt-16 md:pb-[100px] md:pt-[120px]"
    >
      <div className="shell flex flex-col items-center">
        <div className="flex w-full max-w-[835px] flex-col items-center gap-4 text-center">
          <Eyebrow>Featured Project</Eyebrow>
          <Heading size={80} min={40} leading={1} mask className="w-full">
            Signature Developments Shaping
          </Heading>
        </div>

        {/* Filter chips: after the heading lines, each chip fades up a beat after the last. */}
        <div className="no-scrollbar -mx-[clamp(16px,5vw,80px)] mt-10 w-[calc(100%+2*clamp(16px,5vw,80px))] overflow-x-auto md:mt-12">
          {/* One green pill glides between chips: it follows the hovered chip, and settles back on the
              selected one when the pointer leaves the row. */}
          <div
            className="mx-auto flex w-max gap-3 px-[clamp(16px,5vw,80px)]"
            onMouseLeave={() => setHoveredChip(null)}
          >
            {filters.map((f, i) => {
              const active = f === filter;
              const lit = f === (hoveredChip ?? filter);
              return (
                <Appear
                  key={f}
                  preset="lift"
                  delay={0.35 + i * 0.08}
                  className="relative shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setFilter(f)}
                    onMouseEnter={() => setHoveredChip(f)}
                    onFocus={() => setHoveredChip(f)}
                    onBlur={() => setHoveredChip(null)}
                    aria-pressed={active}
                    className={cn(
                      "relative flex h-[42px] items-center justify-center whitespace-nowrap rounded-[40px] text-[14px] font-medium uppercase tracking-[2px] transition-colors duration-300",
                      // Turn white as the gliding pill arrives under the label, not before it.
                      lit && "delay-150",
                      f === ALL ? "px-6" : "h-[45px] px-5",
                      lit ? "text-white" : "text-sage",
                    )}
                  >
                    {lit && (
                      <motion.span
                        layoutId="chip"
                        transition={{
                          type: "spring",
                          bounce: 0,
                          duration: 0.7,
                        }}
                        className="absolute inset-0 rounded-[40px] bg-green"
                      />
                    )}
                    {!lit && (
                      <span className="absolute inset-0 rounded-[40px] border border-chip" />
                    )}
                    {/* Labels sit above the pill, so it never covers a neighbour's label while it glides past. */}
                    <span className="trim relative z-10 leading-[1.7]">
                      {f}
                    </span>
                  </button>
                </Appear>
              );
            })}
          </div>
        </div>

        <motion.div
          ref={gridRef}
          layout
          className="mt-12 grid w-full grid-cols-1 gap-x-10 gap-y-12 md:mt-20 lg:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard
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

        {/* Block wrapper: inside the flex column the sentinel would sit at the column's top and fire with the heading. */}
        <div className="relative mt-14 md:mt-20">
          <Appear preset="lift">
            <GreenPill href="/projects" arrow>
              {initialProjects.length > 0 ? `explore ${initialProjects.length} projects` : "explore all projects"}
            </GreenPill>
          </Appear>
        </div>
      </div>
    </section>
  );
}
