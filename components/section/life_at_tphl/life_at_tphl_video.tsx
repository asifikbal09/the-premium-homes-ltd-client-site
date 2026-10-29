"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { PlayButton, VideoModal } from "@/components/ui/video_modal";
import { FILM } from "@/lib/media";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const POSTER = "/image/life-at-tphl/vedioImage.png";
const TITLE = "Life at TPHL film";

/**
 * Figma: a 1196 × 600 film card, 48px corners, cream play disc in the middle. As it scrolls in the
 * card opens up from a smaller, rounder frame while the poster settles from a slight zoom.
 */
export function LifeAtTphlVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [48, 48] : [120, 48]);
  const zoom = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.25, 1]);

  return (
    <section aria-label="Life At TPHL film" className="bg-white py-[clamp(40px,6.25vw,100px)]">
      <div className="shell">
        <motion.div
          ref={ref}
          style={{ scale, borderRadius: radius }}
          className="group relative mx-auto aspect-[1196/600] max-w-[1196px] overflow-hidden bg-[#d9d9d9] max-md:!rounded-[24px]"
        >
          <motion.div style={{ scale: zoom }} className="absolute inset-0">
            <Image src={POSTER} alt="TPHL relationship managers walking clients through a home" fill sizes="(min-width: 1280px) 1196px, 92vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/25" />
          {/* A soft ring pulses out of the play disc to invite the click. */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {!reduce && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-warm/40 [animation-duration:2.2s]" />}
            <PlayButton onClick={() => setOpen(true)} label="Play Life at TPHL film" className="relative" />
          </div>
        </motion.div>
      </div>

      <VideoModal open={open} onClose={() => setOpen(false)} poster={POSTER} title={TITLE} sources={FILM} />
    </section>
  );
}
