"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear, Shutter, Words } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { DrawnRule } from "./drawn_rule";

const DIR = "/image/about/mission";

/** Figma: 152 × 440 outer photos, 260 × 600 inner ones; the text column sits between the pairs. */
const LEFT = [
  { src: `${DIR}/model-review.png`, alt: "TPHL team reviewing a scale model", small: true },
  { src: `${DIR}/plan-review.png`, alt: "TPHL team going over floor plans", small: false },
];
const RIGHT = [
  { src: `${DIR}/team-game.png`, alt: "TPHL team playing a game in the lounge", small: false },
  { src: `${DIR}/festive.png`, alt: "TPHL team at a festive gathering", small: true },
];

const BLOCKS = [
  {
    title: "Mission",
    copy: "Make apartment ownership accessible for middle-income families and NRBs through structured plans, clear processes, and customer-friendly support.",
  },
  {
    title: "Vision",
    copy: "Build the most trusted digital-first real estate buying experience in Bangladesh while growing toward 100+ projects.",
  },
];

type PhotoSpec = (typeof LEFT)[number];

function Photo({ p, y, delay }: { p: PhotoSpec; y: MotionValue<number>; delay: number }) {
  return (
    <motion.div
      style={{ y }}
      className={cn("relative shrink-0", p.small ? "w-[clamp(80px,9.5vw,152px)] aspect-[152/440]" : "w-[clamp(140px,16.25vw,260px)] aspect-[260/600]")}
    >
      <Shutter delay={delay} tone="bg-green-deep" className="relative size-full">
        <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 17vw, 40vw" className="object-cover" />
      </Shutter>
    </motion.div>
  );
}

/**
 * Photos open with the shutter, the outer pair drifting faster than the inner pair as the section
 * scrolls; each title masks up, its rule draws across and the copy follows.
 */
export function AboutMissionVision() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const outer = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const inner = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} aria-label="Mission and vision" className="relative overflow-hidden bg-green-deep py-[clamp(64px,9.4vw,150px)]">
      <div className="shell flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-[clamp(32px,4vw,64px)]">
        <div className="hidden items-center gap-4 lg:flex">
          {LEFT.map((p, i) => (
            <Photo key={p.src} p={p} y={p.small ? outer : inner} delay={i * 0.12} />
          ))}
        </div>

        <div className="flex w-full max-w-[456px] flex-col gap-[clamp(56px,7.25vw,116px)]">
          {BLOCKS.map((b, i) => (
            <div key={b.title} className="flex flex-col gap-8">
              <Words as="h3" text={b.title} mask delay={0.1 + i * 0.2} className="font-display font-medium leading-none text-gold text-[clamp(26px,2vw,32px)]" />
              <div className="flex flex-col gap-6">
                <div className="w-[98.25%]">
                  <DrawnRule tone="dark" delay={0.2 + i * 0.2} />
                </div>
                <Appear as="p" preset="lift" delay={0.3 + i * 0.2} className="text-[clamp(15px,1.125vw,18px)] capitalize leading-[1.4] text-white">
                  {b.copy}
                </Appear>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {RIGHT.map((p, i) => (
            <Photo key={p.src} p={p} y={p.small ? outer : inner} delay={0.24 + i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
