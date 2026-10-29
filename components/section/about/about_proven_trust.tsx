"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear, Counter, Shutter } from "@/components/ui/motion";
import { GreenPill, Heading } from "@/components/ui/primitives";
import { DrawnRule } from "./drawn_rule";

/** Figma "Built on trust" frame: 1600 × 1393. */
const W = 1600;
const H = 1393;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const COPY =
  "At TPHL (The Premium Homes Ltd.), trust is not a claim, it’s our foundation. From transparent dealings to on-time delivery, every decision we make is guided by our commitment to quality, integrity, and the confidence of our customers.";

const STATS = [
  { value: "1200+", label: "Happy clients", x: 928, y: 569 },
  { value: "4.9/5", label: "Average rating", x: 928, y: 831 },
  { value: "52+", label: "Ongoing projects", x: 70, y: 1092 },
  { value: "98%", label: "Satisfaction rate", x: 532, y: 1092 },
];

const PHOTOS = [
  { src: "/image/about/second_section03.png", alt: "Patterned screen beside a sea-view lounge", x: 197.55, y: 160, w: 192.28, h: 253.57, drift: 70 },
  { src: "/image/about/second_section02.png", alt: "Double-height lobby with a chandelier", x: 1235.36, y: 286.59, w: 175.49, h: 210.75, drift: 110 },
  { src: "/image/about/second_section01.png", alt: "TPHL advisers talking with clients", x: 1177, y: 1075, w: 343, h: 232, drift: 50 },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-start gap-[2.5px] whitespace-nowrap">
      <Counter
        value={value}
        className="font-display font-normal leading-none text-green text-[clamp(52px,9.25vw,148px)]"
      />
      <Appear as="p" preset="lift" delay={0.4} className="text-[clamp(14px,1.125vw,18px)] uppercase leading-[1.4] text-sage">
        {label}
      </Appear>
    </div>
  );
}

/**
 * Heading masks up, the photos open with the shutter and drift at their own pace as the section
 * scrolls, the rule draws across, and each figure rolls up on its odometer as it comes into view.
 */
export function AboutProvenTrust() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drifts = [
    useTransform(scrollYProgress, [0, 1], [PHOTOS[0].drift, -PHOTOS[0].drift]),
    useTransform(scrollYProgress, [0, 1], [PHOTOS[1].drift, -PHOTOS[1].drift]),
    useTransform(scrollYProgress, [0, 1], [PHOTOS[2].drift, -PHOTOS[2].drift]),
  ];

  return (
    <section ref={ref} aria-label="Built on trust, proven by delivery" className="relative overflow-hidden bg-white">
      {/* Desktop: the Figma frame, every box placed as a share of 1600 × 1393. */}
      <div className="relative mx-auto hidden aspect-[1600/1393] w-full max-w-[1600px] lg:block">
        <div className="absolute inset-x-0 flex justify-center" style={{ top: pct(75, H) }}>
          <Heading size={72} min={48} leading={1.1} mask className="w-[37.4%] text-center">
            Built on trust proven by delivery
          </Heading>
        </div>

        {PHOTOS.map((p, i) => (
          <motion.div
            key={p.src}
            className="absolute"
            style={{ left: pct(p.x, W), top: pct(p.y, H), width: pct(p.w, W), aspectRatio: `${p.w} / ${p.h}`, y: drifts[i] }}
          >
            <Shutter delay={0.1 * i} className="relative size-full">
              <Image src={p.src} alt={p.alt} fill sizes="22vw" className="object-cover" />
            </Shutter>
          </motion.div>
        ))}

        <div className="absolute" style={{ left: pct(80, W), top: pct(548, H), width: pct(568.44, W) }}>
          <DrawnRule tone="light" />
        </div>
        <Appear
          as="p"
          preset="lift"
          className="absolute text-[clamp(15px,1.125vw,18px)] capitalize leading-[1.4] text-sage"
          style={{ left: pct(80, W), top: pct(583.27, H), width: pct(587.76, W) }}
        >
          {COPY}
        </Appear>
        <div className="absolute" style={{ left: pct(80, W), top: pct(745, H) }}>
          <Appear preset="lift" delay={0.15}>
            <GreenPill href="/projects" arrow className="h-12 px-[29px] text-[16px] text-white">
              explore projects
            </GreenPill>
          </Appear>
        </div>

        {STATS.map((s) => (
          <div key={s.label} className="absolute" style={{ left: pct(s.x, W), top: pct(s.y, H) }}>
            <Stat {...s} />
          </div>
        ))}
      </div>

      {/* Phones and tablets: the same parts in reading order. */}
      <div className="shell flex flex-col gap-10 py-16 lg:hidden">
        <Heading size={72} min={40} leading={1.1} mask className="text-center">
          Built on trust proven by delivery
        </Heading>
        <div className="grid grid-cols-2 gap-4">
          {PHOTOS.slice(0, 2).map((p) => (
            <Shutter key={p.src} className="relative aspect-[192/254]">
              <Image src={p.src} alt={p.alt} fill sizes="50vw" className="object-cover" />
            </Shutter>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <DrawnRule tone="light" />
          <Appear as="p" preset="lift" className="text-[16px] capitalize leading-[1.4] text-sage">
            {COPY}
          </Appear>
          <Appear preset="lift" delay={0.15}>
            <GreenPill href="/projects" arrow className="h-12 px-[29px] text-[16px] text-white">
              explore projects
            </GreenPill>
          </Appear>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
        <Shutter className="relative aspect-[343/232]">
          <Image src={PHOTOS[2].src} alt={PHOTOS[2].alt} fill sizes="100vw" className="object-cover" />
        </Shutter>
      </div>
    </section>
  );
}
