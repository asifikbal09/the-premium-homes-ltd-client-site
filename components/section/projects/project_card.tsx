"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HoverShutter } from "@/components/ui/hover_shutter";
import type { ProjectData } from "@/lib/projects";
import { SPRING } from "@/lib/utils";

const FALLBACK_IMAGE = "/image/projects/projectsHero.png";

function Spec({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      <Image src={`/projects/icons/${icon}.svg`} alt="" width={16} height={16} className="size-4 shrink-0" />
      <span className="trim whitespace-nowrap text-[13px] uppercase leading-none text-sage">
        {children}
      </span>
    </span>
  );
}

/**
 * Figma "Featured Project" card. Fades up as it scrolls in, a beat after the card to its left; cards
 * mounted or dropped by a filter enter and leave on the grid's layout animation. On hover the
 * second photo opens over the first with the shutter and the rule draws across in green.
 */
export function ProjectCard({
  project,
  index = 0,
  armed = true,
}: {
  project: ProjectData;
  /** Position in the grid, for the stagger across a row. */
  index?: number;
  /** Mount the hover photo only once a mouse has entered the grid. */
  armed?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(project.image);
  const href = `/projects/${project.slug || project.id}`;
  const blurb = project.hover_text || project.description;

  return (
    <motion.article
      layout
      initial={{ opacity: 0.001, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
      transition={{ ...SPRING, delay: (index % 3) * 0.12 }}
      className="group flex flex-col gap-4"
    >
      <Link
        href={href}
        aria-label={`View details of ${project.name}`}
        className="zoom-frame relative block aspect-[466/336]"
      >
        <div className="absolute inset-0">
          <Image
            src={imgSrc}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </div>
        {project.image2 && (
          <HoverShutter
            src={project.image2}
            armed={armed}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        )}
        {project.tag && (
          <span className="glass-light absolute left-4 top-4 inline-flex h-[27px] items-center overflow-hidden rounded-full bg-[rgba(10,30,40,0.14)] px-[11px] text-[10px] font-medium uppercase tracking-[1.33px] text-white backdrop-blur-[4px]">
            <span className="trim leading-[1.7]">{project.tag}</span>
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-[11px]">
            <h3 className="trim truncate font-display text-[24px] font-medium capitalize leading-[1.5] text-green">
              <Link href={href}>{project.name}</Link>
            </h3>
            {blurb && (
              <p className="line-clamp-2 max-w-[238px] text-[12px] leading-[1.4] text-sage">
                {blurb}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-[11px] leading-[1.5]">
            <p className="trim text-right text-[12px] tracking-[-0.24px] text-[#667085]">
              Starting from
            </p>
            <p className="trim whitespace-nowrap text-[14px] tracking-[-0.14px] text-ink">
              {project.price_range || project.price}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="relative block h-px w-full overflow-hidden bg-stone-2/40">
            <span className="absolute inset-0 origin-left scale-x-0 bg-green transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
              {project.size && <Spec icon="house">{project.size}</Spec>}
              {project.beds ? <Spec icon="balcony">{project.beds} BHK</Spec> : null}
              {project.building_type && (
                <span className="trim whitespace-nowrap text-[13px] uppercase leading-none text-sage">
                  {project.building_type}
                </span>
              )}
            </div>
            <Link
              href={`${href}#contact`}
              className="press inline-flex shrink-0 items-center rounded-full border-[0.666px] border-[#e0d1b6] bg-white px-4 py-3 text-[12px] font-medium uppercase text-green hover:border-green"
            >
              <span className="trim leading-[1.7]">Contact now</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
