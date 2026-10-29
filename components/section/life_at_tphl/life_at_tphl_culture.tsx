"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Appear, Counter } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SETTLE, fluid } from "@/lib/utils";

const PILLARS = [
  { number: "01", title: "Trust in every decision", copy: "We work with clarity, honesty, and shared responsibility." },
  { number: "02", title: "Ownership in every role", copy: "Everyone has space to take responsibility and make an impact." },
  { number: "03", title: "Growth through learning", copy: "We support people who want to improve, lead, and grow." },
  { number: "04", title: "Collaboration across teams", copy: "Sales, engineering, operations, support work together on one goal." },
];

/**
 * Figma "A culture of trust": centred heading over four 420px-tall columns split by hairlines.
 * On entry each hairline draws downward, the numbers roll up like an odometer and the copy rises.
 */
export function LifeAtTphlCulture() {
  const gridRef = useRef<HTMLDivElement>(null);
  const play = useInView(gridRef, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  return (
    <section aria-label="A culture of trust, growth, and ownership" className="bg-sage py-[clamp(64px,7.5vw,120px)] text-white">
      <div className="shell flex flex-col items-center gap-[clamp(48px,6.25vw,100px)]">
        <Heading size={72} min={36} leading={1} mask className="max-w-[770px] text-center text-white">
          A Culture of Trust, Growth, and Ownership.
        </Heading>

        <div ref={gridRef} className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <div
              key={p.number}
              className="group relative flex min-h-[260px] flex-col justify-between gap-12 px-[clamp(20px,2.25vw,36px)] py-6 transition-colors duration-500 hover:bg-white/[0.05] lg:h-[420px]"
            >
              {/* Hairline on the right (desktop/tablet) or bottom (phone), drawn on entry. */}
              <motion.span
                aria-hidden
                initial={{ scaleY: 0 }}
                animate={{ scaleY: play ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 1.2, ease: SETTLE, delay: 0.2 + i * 0.12 }}
                className="absolute right-0 top-0 hidden h-full w-px origin-top bg-white/50 sm:block"
              />
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: play ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 1.2, ease: SETTLE, delay: 0.2 + i * 0.12 }}
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-white/50 sm:hidden"
              />

              <span className="font-display font-medium leading-none" style={{ fontSize: fluid(72, 48) }}>
                <Counter value={p.number} />
              </span>
              <div className="flex flex-col gap-6 capitalize">
                <Appear as="p" preset="lift" play={play} delay={0.45 + i * 0.12} className="max-w-[240px] font-display font-medium leading-[1.2]" style={{ fontSize: fluid(32, 24) }}>
                  {p.title}
                </Appear>
                <Appear as="p" preset="lift" play={play} delay={0.55 + i * 0.12} className="text-[16px] leading-[1.4] text-white/85">
                  {p.copy}
                </Appear>
              </div>
              {/* Gold underline grows on hover. */}
              <span aria-hidden className="absolute bottom-0 left-[clamp(20px,2.25vw,36px)] h-[2px] w-0 bg-gold transition-[width] duration-700 ease-out-expo group-hover:w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
