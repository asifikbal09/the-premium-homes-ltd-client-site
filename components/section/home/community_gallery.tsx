"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Shutter } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";
import { fluid } from "@/lib/utils";

/* Collage positions from the 1600 × 1080 Figma frame ("Heri animation flow"). */
type Photo = {
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
  crop?: React.CSSProperties;
  position?: string;
  speed: number;
};

const PHOTOS: Photo[] = [
  {
    x: 1353,
    y: 167,
    w: 203,
    h: 232,
    src: "community-a",
    crop: { left: "-72.42%", top: 0, width: "172.64%", height: "100%" },
    speed: -140,
  },
  {
    x: 916,
    y: 892,
    w: 173,
    h: 198,
    src: "community-a",
    crop: {
      left: "-153.31%",
      top: "-93.32%",
      width: "406.63%",
      height: "235.53%",
    },
    speed: -260,
  },
  {
    x: 1331,
    y: 708,
    w: 189,
    h: 216,
    src: "community-b",
    position: "bottom",
    speed: -320,
  },
  { x: 417, y: 743, w: 256, h: 293, src: "community-c", speed: -200 },
  { x: -11, y: 816, w: 171, h: 195, src: "community-c", speed: -90 },
  { x: 221, y: 266, w: 161, h: 184, src: "community-c", speed: -240 },
  { x: 653, y: 266, w: 286, h: 327, src: "community-d", speed: -120 },
];

const AMENITIES = [
  { title: "Rooftop Park", word: "Park", src: "amenity-rooftop" },
  { title: "Swimming pool", word: "pool", src: "amenity-pool" },
  { title: "Parking", word: "Car", src: "amenity-parking" },
  { title: "Fitness Zone", word: "Play", src: "amenity-fitness" },
];

const STEP = 76; // visible strip of each stacked card

/** `sizes` for a collage photo, accounting for Figma crops that render the image wider than its frame. */
function collageSizes(p: Photo) {
  const crop =
    typeof p.crop?.width === "string" ? parseFloat(p.crop.width) / 100 : 1;
  const vw = (p.w / 1600) * 100 * crop;
  return `(min-width: 768px) ${vw.toFixed(1)}vw, ${(vw * 1.6).toFixed(1)}vw`;
}

function CollagePhoto({
  p,
  i,
  progress,
}: {
  p: Photo;
  i: number;
  progress: MotionValue<number>;
}) {
  // Each photo drifts at its own speed; the collage gains depth as you scroll.
  const y = useTransform(progress, [0, 1], [-p.speed * 0.5, p.speed * 0.5]);
  // Inside the frame the picture slides the other way, so the frame reads as a window onto it.
  const innerY = useTransform(progress, [0, 1], ["7%", "-7%"]);
  return (
    <motion.div
      style={{
        y,
        left: `${(p.x / 1600) * 100}%`,
        top: `${(p.y / 1080) * 100}%`,
        width: `${(p.w / 1600) * 100}%`,
        height: `${(p.h / 1080) * 100}%`,
      }}
      className="absolute will-change-transform"
    >
      {/* Each photo opens like a shutter, one after another; the hover zoom lives inside it. */}
      <Shutter
        delay={0.1 + i * 0.1}
        shadow="0 20px 40px -24px rgba(0,0,0,0.35)"
        className="relative size-full"
      >
        <div className="zoom-frame relative size-full overflow-hidden">
          <div className="absolute inset-0">
            {/* Oversized by 12% so the parallax slide never shows an edge. */}
            <motion.div
              style={{ y: innerY }}
              className="absolute inset-[-12%] will-change-transform"
            >
              <div className="absolute" style={p.crop ?? { inset: 0 }}>
                <Image
                  src={`/home/img/${p.src}.png`}
                  alt="Families enjoying Premium Homes community spaces"
                  fill
                  sizes={collageSizes(p)}
                  className="object-cover"
                  style={{ objectPosition: p.position ?? "center" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Shutter>
    </motion.div>
  );
}

function AmenityRow({
  a,
  i,
  progress,
}: {
  a: (typeof AMENITIES)[number];
  i: number;
  progress: MotionValue<number>;
}) {
  const last = i === AMENITIES.length - 1;
  const start = i / AMENITIES.length;
  const scale = useTransform(
    progress,
    [start, 1],
    [1, last ? 1 : 1 - (AMENITIES.length - 1 - i) * 0.025],
  );
  const wordX = useTransform(
    progress,
    [start - 0.25, start + 0.2],
    ["30%", "0%"],
  );

  return (
    <motion.div
      style={{ top: `calc(clamp(16px, 4vh, 40px) + ${i * STEP}px)`, scale }}
      className="sticky origin-top bg-white py-5 will-change-transform"
    >
      {/* Phones put the title first so each collapsed card in the stack still reads as a label. */}
      <div className="grid gap-6 md:grid-cols-[40.2%_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)] md:gap-x-10 md:gap-y-6">
        <h3
          className="order-first font-display font-normal leading-none text-green md:col-start-2 md:row-start-1"
          style={{ fontSize: fluid(48, 30) }}
        >
          {a.title}
        </h3>
        {/* Opens like a shutter as it scrolls in, same as the collage above; hover zoom lives inside. */}
        <Shutter className="relative aspect-[588/600] w-full md:col-start-1 md:row-start-1 md:row-span-2 lg:aspect-auto lg:h-[clamp(320px,calc(100vh-300px),600px)]">
          <div className="zoom-frame relative size-full">
            <div className="absolute inset-0">
              <Image
                src={`/home/img/${a.src}.jpg`}
                alt={a.title}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Shutter>
        <div className="min-w-0 overflow-hidden font-display font-normal leading-none md:col-start-2 md:row-start-2 md:self-end">
          <motion.p
            aria-hidden
            style={{ x: wordX, fontSize: fluid(400, 120) }}
            className="text-sage/20"
          >
            {a.word}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export function CommunityGallery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stageProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: stackProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="community" className="relative bg-white pb-16 md:pb-[100px]">
      <div ref={stageRef} className="relative">
        <div className="shell relative z-10 flex flex-col items-center gap-4 pt-12 text-center lg:absolute lg:inset-x-0 lg:top-[50px] lg:pt-0">
          <Eyebrow>Gallery</Eyebrow>
          <Heading size={80} min={38} mask className="sm:whitespace-nowrap">
            Creating better living
          </Heading>
        </div>

        <div className="relative w-full overflow-hidden [--cw:31.86vw] md:[--cw:19.91vw]">
          {/* "Community" runs right to left without end, edge to edge of the screen: two identical halves,
              the track slides by half its width (one word is already a full screen, so one per half keeps the
              animated layer small). One word measures 5.022× its font size in K Victor, so
              19.91vw makes it exactly one screen wide. */}
          <div
            aria-hidden
            style={{ fontSize: "var(--cw, 19.91vw)", top: "40.83%" }}
            className="absolute inset-x-0 overflow-visible font-display font-normal capitalize leading-none text-green"
          >
            <div
              className="flex w-max will-change-transform"
              style={{ animation: "marquee 17s linear infinite" }}
            >
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0 whitespace-nowrap">
                  <span className="pr-[0.45em]">Community</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[1600px]">
            {/* Phones zoom the collage 1.6× and crop it, like the word already bleeds on desktop. */}
            <div className="relative ml-[-30%] aspect-[1600/1080] w-[160%] md:ml-0 md:w-full">
              {PHOTOS.map((p, i) => (
                <CollagePhoto key={i} p={p} i={i} progress={stageProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={stackRef}
        className="mx-auto mt-16 w-full max-w-[1600px] px-[clamp(16px,4.25vw,68px)] md:mt-[120px]"
      >
        {AMENITIES.map((a, i) => (
          <AmenityRow key={a.title} a={a} i={i} progress={stackProgress} />
        ))}
      </div>
    </section>
  );
}
