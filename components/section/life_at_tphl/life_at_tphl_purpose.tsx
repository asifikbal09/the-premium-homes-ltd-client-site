"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear, Shutter } from "@/components/ui/motion";
import { GreenPill, Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { fluid } from "@/lib/utils";

const COPY =
  "At TPHL, every project begins with people. From our sales teams to project managers, engineers, designers, and support teams, we work together to build homes, trust, and long-term value for families across Bangladesh.";

// Figma columns inside the 1440 shell: heading at 0, photos and copy from 517.
const GRID = "lg:grid-cols-[517fr_923fr]";

/**
 * Figma "Built by people": heading on the left, two photos on the right, a huge hairline
 * "purpose" running behind them and the copy below. The photos open with a shutter and the
 * watermark slides across as the section scrolls by.
 */
export function LifeAtTphlPurpose() {
  const markRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: markRef, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["12%", "-12%"]);

  return (
    <section aria-label="Built by people, driven by purpose" className="relative overflow-hidden bg-white pb-[clamp(56px,7.5vw,120px)] pt-[clamp(40px,7.5vw,120px)]">
      <div className={`shell relative z-10 grid gap-10 ${GRID}`}>
        <Heading as="h2" size={100} min={48} leading={1} mask className="max-w-[443px]">
          Built by People. Driven by Purpose.
        </Heading>

        {/* Photos share a bottom edge, 60px apart (Figma 370 × 494 and 206 × 275). */}
        <div className="relative flex items-end gap-[clamp(16px,3.75vw,60px)] lg:pt-[39px]">
          <Shutter className="relative aspect-[370/494] w-[60%] max-w-[370px]">
            <div className="absolute inset-0">
              <Image src="/image/life-at-tphl/tplt-team05.png" alt="TPHL architect reviewing the community master plan" fill sizes="(min-width: 1024px) 370px, 55vw" className="object-cover" />
            </div>
          </Shutter>
          <Shutter delay={0.2} className="relative aspect-[206/275] w-[34%] max-w-[206px]">
            <div className="absolute inset-0">
              <Image src="/image/life-at-tphl/vedioImage.png" alt="TPHL relationship manager showing clients around a home" fill sizes="(min-width: 1024px) 206px, 32vw" className="object-cover object-[38%_50%]" />
            </div>
          </Shutter>
        </div>
      </div>

      {/* Hairline watermark: tucked 112px under the photos on the canvas. */}
      <div ref={markRef} aria-hidden className="pointer-events-none relative -mt-[clamp(8px,7vw,112px)] select-none">
        <motion.p
          style={{ x, fontSize: fluid(430, 120) }}
          className="whitespace-nowrap text-center font-display font-thin lowercase leading-none text-green/12"
        >
          purpose
        </motion.p>
      </div>

      <div className={`shell relative z-10 mt-[clamp(24px,4.6vw,74px)] grid ${GRID}`}>
        <div className="flex max-w-[712px] flex-col items-start gap-6 lg:col-start-2">
          <Appear as="p" preset="lift" className="capitalize leading-[1.4] text-sage" style={{ fontSize: fluid(24, 16) }}>
            {COPY}
          </Appear>
          <Appear preset="lift" delay={0.15}>
            <GreenPill href="/career" arrow className="h-12 px-[29px] text-[16px] text-white">
              join our team
            </GreenPill>
          </Appear>
        </div>
      </div>
    </section>
  );
}
