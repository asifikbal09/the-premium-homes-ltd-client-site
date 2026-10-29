"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SETTLE } from "@/lib/utils";

const RULES = {
  /** Gold hairline with a deep green tab, for light sections. */
  light: { src: "/image/about/mission/rule-light.svg", ratio: "568.443 / 5.878" },
  /** White hairline with a gold tab, for dark sections. */
  dark: { src: "/image/about/mission/rule-dark.svg", ratio: "448 / 6" },
};

/** Figma's divider rule (a hairline with a short tab at its start), drawn in from the left once in view. */
export function DrawnRule({ tone, delay = 0 }: { tone: keyof typeof RULES; delay?: number }) {
  const reduce = useReducedMotion();
  const { src, ratio } = RULES[tone];
  // The in-view check sits on the unclipped wrapper: a fully clipped element never counts as visible.
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      className="relative w-full"
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, shown: { clipPath: "inset(0 0% 0 0)" } }}
        transition={{ duration: reduce ? 0 : 1.2, ease: SETTLE, delay }}
        className="absolute inset-0"
      >
        <Image src={src} alt="" fill loading="eager" className="object-fill" />
      </motion.div>
    </motion.div>
  );
}
