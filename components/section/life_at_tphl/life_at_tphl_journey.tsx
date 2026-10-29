"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { Shutter, Words } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { fluid } from "@/lib/utils";

type JourneyItem = {
  title: string;
  watermark: string;
  image: string;
  alt: string;
  color: string;
  /** Figma sets "Festive" at 200px, the rest at 172px. */
  markSize: number;
};

const JOURNEY: JourneyItem[] = [
  { title: "Festival Celebrations", watermark: "Festive", image: "/image/life-at-tphl/journey/tphl-journey02.png", alt: "TPHL team celebrating a festival in traditional attire", color: "#973225", markSize: 200 },
  { title: "Team Outings", watermark: "Outdoor", image: "/image/life-at-tphl/journey/tphl-journey03.png", alt: "TPHL team planting trees on a community outing", color: "#546360", markSize: 172 },
  { title: "Special Days", watermark: "Special", image: "/image/life-at-tphl/journey/tphl-journey04.png", alt: "TPHL team cutting a cake together on a special day", color: "#89553f", markSize: 172 },
  { title: "Team Lunches", watermark: "Lunches", image: "/image/life-at-tphl/journey/tphl-journey05.png", alt: "TPHL team sharing lunch in the office", color: "#635454", markSize: 172 },
  { title: "Project Milestones", watermark: "Project", image: "/image/life-at-tphl/journey/tphl-journey01.png", alt: "TPHL project team around a building scale model", color: "#4c4d27", markSize: 172 },
];

/**
 * One coloured row. From tablet up the rows are sticky, so each one slides over the last and the
 * covered row sinks back a little. The watermark word slides in from the right as the row arrives.
 */
function JourneyRow({ item, i, progress }: { item: JourneyItem; i: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const n = JOURNEY.length;
  // Shrink once the next row starts to cover this one; the last row never shrinks.
  const start = i / n;
  const scale = useTransform(progress, [start, 1], reduce || i === n - 1 ? [1, 1] : [1, 1 - (n - i) * 0.03]);

  return (
    <div
      className="md:sticky"
      style={{ top: `calc(clamp(88px,6.25vw,100px) + ${i * 16}px)`, "--row": item.color } as CSSProperties}
    >
      <motion.article
        style={{ scale, backgroundColor: item.color }}
        className="flex origin-top flex-col gap-5 p-3 max-md:![transform:none] sm:p-5 md:flex-row md:gap-10"
      >
        <Shutter tone="bg-[var(--row)]" className="relative aspect-[732/600] w-full md:w-[51.4%] md:shrink-0">
          <div className="absolute inset-0">
            <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 46vw, 92vw" className="object-cover" />
          </div>
        </Shutter>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-8 overflow-hidden font-display font-normal leading-none text-white">
          <Words as="h3" text={item.title} by="words" className="pt-1" style={{ fontSize: fluid(48, 28) }} />
          <Words
            as="p"
            text={item.watermark}
            by="chars"
            mask
            className="whitespace-nowrap opacity-20"
            style={{ fontSize: fluid(item.markSize, 64) }}
          />
        </div>
      </motion.article>
    </div>
  );
}

/** Figma "More than work, a shared journey": five full-width coloured rows, one per occasion. */
export function LifeAtTphlJourney() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    // overflow-x-clip (not hidden) so the sticky rows still stick to the page.
    <section aria-label="More than work, a shared journey" className="overflow-x-clip bg-white py-[clamp(56px,6.25vw,100px)]">
      <div className="shell flex justify-center">
        <Heading size={72} min={36} leading={1} mask className="max-w-[600px] text-center">
          More Than Work, A Shared Journey.
        </Heading>
      </div>

      <div ref={stackRef} className="mx-auto mt-[clamp(40px,4.5vw,72px)] flex w-full max-w-[1600px] flex-col gap-6 px-[clamp(16px,4.25vw,68px)] md:gap-14">
        {JOURNEY.map((item, i) => (
          <JourneyRow key={item.title} item={item} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
