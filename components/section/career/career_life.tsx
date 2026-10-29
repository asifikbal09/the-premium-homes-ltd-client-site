"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Shutter } from "@/components/ui/motion";
import { SectionIntro } from "@/components/section/shared/section_intro";
import { fluid } from "@/lib/utils";

type Photo = {
  src: string;
  alt: string;
  /** Figma frame size on the 1600 canvas. */
  w: number;
  h: number;
  /** Figma crop of the photo inside its frame. */
  position?: string;
};

// Figma "About Taameer V.2": seven frames growing to the 400px centre one; the outer two overhang the canvas.
const PHOTOS: Photo[] = [
  { src: "/image/career/career06.png", alt: "Premium Homes community gathering", w: 200, h: 247 },
  { src: "/image/career/career03.png", alt: "Premium Homes team gathering on the field", w: 260, h: 322, position: "right" },
  { src: "/image/career/career04.png", alt: "Team celebration and gifting", w: 300, h: 371, position: "46% 50%" },
  { src: "/image/career/career05.png", alt: "Premium Homes leadership at the BYD showroom", w: 400, h: 495, position: "bottom" },
  { src: "/image/career/career02.png", alt: "Executive discussion and agreement signing", w: 300, h: 371, position: "78% 50%" },
  { src: "/image/career/career01.png", alt: "Team members at a development site", w: 260, h: 322, position: "top" },
  { src: "/image/career/career06.png", alt: "Premium Homes community gathering", w: 200, h: 247 },
];
const CENTRE = (PHOTOS.length - 1) / 2;

/**
 * Photos open with the shutter from the centre outwards; while the section scrolls by, the strip
 * slides sideways and each photo zooms a touch on hover.
 */
export function CareerLife() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} aria-label="Life at Premium Homes" className="overflow-hidden bg-sage py-[clamp(64px,7.5vw,120px)]">
      <div className="shell">
        <SectionIntro
          eyebrow="Life at Premium Homes"
          title="A Glimpse Into Life at Premium Homes"
          light
          className="mx-auto max-w-[714px]"
        />
      </div>
      <motion.div
        style={{ x, gap: fluid(32, 12) }}
        className="relative left-1/2 mt-[clamp(48px,5vw,80px)] flex w-max -translate-x-1/2 items-center"
      >
        {PHOTOS.map((p, i) => (
          <div key={i} className="shrink-0" style={{ width: fluid(p.w, p.w * 0.6) }}>
            <Shutter
              tone="bg-sage"
              delay={Math.abs(i - CENTRE) * 0.12}
              className="relative w-full"
            >
              <div className="zoom-frame relative size-full" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                <div className="absolute inset-0">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={`${Math.round((p.w / 1600) * 100)}vw`}
                    className="object-cover"
                    style={{ objectPosition: p.position }}
                  />
                </div>
              </div>
            </Shutter>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
