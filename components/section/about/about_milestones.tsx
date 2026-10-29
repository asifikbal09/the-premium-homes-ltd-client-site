"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Shutter, Words } from "@/components/ui/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SETTLE } from "@/lib/utils";

const MILESTONES = [
  {
    year: "2023",
    title: "Foundation",
    copy: "Started with a vision to transform urban living",
    image: "/image/life-at-tphl/tplt-team04.png",
    alt: "TPHL vision presentation to the team",
  },
  {
    year: "2024",
    title: "Smart City Initiative",
    copy: "Introduced The Premium Smart City in Ashulia Model Town",
    image: "/image/life-at-tphl/tplt-team03.png",
    alt: "TPHL Smart City initiative in Ashulia Model Town",
  },
  {
    year: "2025",
    title: "40+ Ongoing Projects",
    copy: "Reached milestone of 40+ ongoing projects",
    image: "/image/life-at-tphl/tplt-team02.png",
    alt: "TPHL team marking 40+ ongoing projects",
  },
  {
    year: "2026",
    title: "52+ Ongoing Projects",
    copy: "Reached milestone of 52+ ongoing projects",
    image: "/image/life-at-tphl/tplt-team1.png",
    alt: "TPHL team marking 52+ ongoing projects",
  },
];

/** Figma steps each later year inward: 0, 72, then 140px. */
const INDENT = ["0px", "clamp(0px,4.5vw,72px)", "clamp(0px,8.75vw,140px)", "clamp(0px,8.75vw,140px)"];

/** One year: full strength while active, Figma's 20% otherwise. The photo eases in as it lights up. */
function Row({ m, i, active }: { m: (typeof MILESTONES)[number]; i: number; active: boolean }) {
  const reduce = useReducedMotion();
  const ease = { duration: reduce ? 0 : 0.6, ease: SETTLE };
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.2 }}
      transition={ease}
      className="flex flex-col gap-8 border-b border-ink pb-10 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex w-full flex-col gap-[clamp(28px,3.75vw,60px)] capitalize lg:w-[37.8%]" style={{ paddingLeft: INDENT[i] }}>
        <div className="flex flex-col gap-[clamp(12px,1.94vw,31px)]">
          <p className="text-right text-[16px] leading-[1.4] text-sage">[{String(i + 1).padStart(2, "0")}]</p>
          <Words as="p" text={m.year} by="chars" mask className="trim font-display font-medium leading-none text-green text-[clamp(96px,15vw,240px)]" />
        </div>
        <div className="flex flex-col gap-3">
          <Words as="h3" text={m.title} mask delay={0.2} className="whitespace-nowrap font-display font-medium leading-none text-green text-[clamp(32px,3.25vw,52px)]" />
          <p className="text-[16px] leading-[1.4] text-ink">{m.copy}</p>
        </div>
      </div>
      <Shutter tone="bg-warm" className="relative aspect-[590/430] w-full overflow-hidden lg:w-[40.93%]">
        <motion.div
          initial={false}
          animate={{ scale: active ? 1 : 1.08 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: SETTLE }}
          className="absolute inset-0"
        >
          <Image src={m.image} alt={m.alt} fill sizes="(min-width: 1024px) 41vw, 100vw" className="object-cover object-[center_30%]" />
        </motion.div>
      </Shutter>
    </motion.div>
  );
}

/**
 * Figma "Milestones": four years in a list, each with its photo. One year reads at a time, starting
 * with the first; it hands over to the next as each row crosses the middle of the screen.
 */
export function AboutMilestones() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(MILESTONES.length - 1, Math.max(0, Math.floor(p * MILESTONES.length))));
  });

  return (
    <section aria-label="TPHL milestones" className="bg-warm pb-[clamp(64px,7.5vw,120px)] pt-[clamp(96px,15.3vw,245px)]">
      <div ref={ref} className="shell flex flex-col gap-[39px]">
        {MILESTONES.map((m, i) => (
          <Row key={m.year} m={m} i={i} active={i === active} />
        ))}
      </div>
    </section>
  );
}
