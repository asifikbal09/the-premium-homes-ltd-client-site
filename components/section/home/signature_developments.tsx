"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import Image, { getImageProps } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Appear, Shutter } from "@/components/ui/motion";
import { GreenPill } from "@/components/ui/primitives";
import { localClip, Sources, type VideoSources } from "@/lib/media";
import type { ProjectData } from "@/lib/projects";
import { cn, SETTLE, SPRING, fluid } from "@/lib/utils";

type Slide = {
  tag: string;
  name: string;
  address: string;
  copy: string;
  image: string;
  /** Figma crop of the card image (relative to its 428×272 frame). */
  crop: React.CSSProperties;
  href: string;
  video: VideoSources;
  poster: string;
};

const FULL_FRAME: React.CSSProperties = { left: 0, top: 0, width: "100%", height: "100%" };

// Background clips: free-licence footage from Pexels, 1080p, silent, as WebM (VP9) with an MP4 fallback (public/home/video).
const CLIPS = [
  { video: localClip("spotlight-villa"), poster: "/home/video/spotlight-villa.jpg" },
  { video: localClip("spotlight-towers"), poster: "/home/video/spotlight-towers.jpg" },
  { video: localClip("spotlight-living"), poster: "/home/video/spotlight-living.jpg" },
];

// Shown only when the projects API returns nothing.
const FALLBACK_SLIDES: Slide[] = [
  {
    tag: "Commercial",
    name: "The Premium Lumina",
    address: "10/23 Bashundhara Residential Area",
    copy: "A landmark address for business in Bashundhara, with double-height lobbies and floors planned around daylight.",
    image: "/home/img/banner-card.png",
    crop: { left: "-4.2%", top: "-3.46%", width: "105.84%", height: "129.27%" },
    href: "/projects",
    ...CLIPS[0],
  },
  {
    tag: "Residential",
    name: "Studio Suite 4.0",
    address: "Ashulia Model Town, Dhaka",
    copy: "Sustainable living in Dhaka's most popular area, framed by green terraces and open skies.",
    image: "/home/img/project-studio.jpg",
    crop: { left: "0%", top: "-3.52%", width: "102.53%", height: "117.35%" },
    href: "/projects",
    ...CLIPS[1],
  },
  {
    tag: "Luxury",
    name: "Prestige Heritage",
    address: "Road 7, Block B, Bashundhara R/A",
    copy: "Calm, light-filled homes with generous living rooms, warm stone and garden views from every floor.",
    image: "/home/img/project-prestige.jpg",
    crop: { left: "0%", top: "-10%", width: "100%", height: "126%" },
    href: "/projects",
    ...CLIPS[2],
  },
];

/** The first projects from the API, one per background clip. */
function toSlides(projects: ProjectData[]): Slide[] {
  if (projects.length === 0) return FALLBACK_SLIDES;
  return projects.slice(0, CLIPS.length).map((p, i) => ({
    tag: p.type || p.status || "Residential",
    name: p.name,
    address: p.location || "Dhaka, Bangladesh",
    copy: p.hover_text || p.description || "",
    image: p.image,
    crop: FULL_FRAME,
    href: `/projects/${p.slug || p.id}`,
    ...CLIPS[i],
  }));
}

export function SignatureDevelopments({ initialProjects = [] }: { initialProjects?: ProjectData[] }) {
  const slides = useMemo(() => toSlides(initialProjects), [initialProjects]);
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The backdrop photo drifts up slowly against the scroll; the card rides a touch faster.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + slides.length) % slides.length);
  };

  // Only the active slide's clip plays, and only while the section is on screen. The bar follows its
  // playhead every frame; when the clip ends the next slide comes in. The others rewind and wait.
  const inView = useInView(ref, { amount: 0.2 });
  // Clips and posters attach only when the section is about a screen away, so they never compete
  // with the first paint; from then on they stay attached.
  const near = useInView(ref, { once: true, margin: "100% 0px 100% 0px" });
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const progress = useMotionValue(0);
  // The card image's shutter is driven from here: it waits for the frame to be seen once, then
  // every slide change opens it straight away, even if the frame's top edge has scrolled off screen.
  const frameRef = useRef<HTMLDivElement>(null);
  const frameSeen = useInView(frameRef, { once: true, amount: 0.25 });
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
        v.currentTime = 0;
      }
    });
    const v = videos.current[index];
    progress.set(0);
    if (!v || !near) return;
    if (!inView) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
    let raf = 0;
    const tick = () => {
      if (v.duration) progress.set(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const next = () => go(1);
    v.addEventListener("ended", next);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("ended", next);
    };
  }, [index, inView, near, progress]);

  const slide = slides[index];

  return (
    <section
      ref={ref}
      className="bg-white pb-16 pt-6 md:pb-[116px] md:pt-[74px]"
    >
      <div className="shell">
        <div className="relative xl:h-[clamp(560px,53.125vw,850px)]">
          {/* Backdrop */}
          <Appear
            preset="grow"
            slow
            amount={0.2}
            className="relative h-[420px] overflow-hidden bg-[#d9d9d9] sm:h-[560px] xl:absolute xl:inset-0 xl:h-auto"
          >
            <motion.div
              style={{ y: bgY }}
              className="absolute inset-[-8.7%_-0.3%]"
            >
              {/* One clip per slide, stacked; the active one fades in over the last. */}
              {slides.map((sl, i) => (
                <video
                  key={sl.name}
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  // Poster through the image optimiser (resized WebP) rather than the raw JPEG.
                  poster={
                    near
                      ? getImageProps({
                          src: sl.poster,
                          alt: "",
                          width: 960,
                          height: 540,
                        }).props.src
                      : undefined
                  }
                  muted
                  playsInline
                  // Only the slide on show buffers; the others load when their turn comes.
                  preload={near && i === index ? "auto" : "none"}
                  aria-hidden
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-opacity duration-[1100ms] ease-out",
                    i === index ? "opacity-100" : "opacity-0",
                  )}
                >
                  {near && <Sources video={sl.video} />}
                </video>
              ))}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(231.83deg, rgba(0,0,0,0.7) 7.59%, rgba(0,0,0,0) 57.02%, rgba(0,0,0,0.7) 100.09%)",
                }}
              />
            </motion.div>
          </Appear>

          {/* Card — Figma: x 836, y 80 inside the 1440 frame. Drops in from above like a Shelta panel. */}
          <motion.div
            style={{ y: cardY }}
            className="relative z-10 mx-auto -mt-16 w-[calc(100%-24px)] max-w-[524px] xl:absolute xl:right-[5.56%] xl:top-[80px] xl:mx-0 xl:mt-0 xl:w-[524px]"
          >
            <Appear
              preset="drop"
              delay={0.25}
              slow
              amount={0.3}
              className="bg-white/[0.94] px-6 py-8 sm:px-12 sm:py-10"
            >
              <div className="flex flex-col items-center gap-8">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={slide.name}
                    custom={dir}
                    initial={{ opacity: 0.001, x: 40 * dir }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: -40 * dir,
                      transition: { duration: 0.3 },
                    }}
                    transition={SPRING}
                    className="flex flex-col items-center gap-4 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p className="trim text-[14px] uppercase leading-[1.5] tracking-[1.28px] text-gold sm:text-[16px]">
                        {slide.tag}
                      </p>
                      <h3
                        className="font-display font-normal capitalize leading-none text-green"
                        style={{ fontSize: fluid(40, 30) }}
                      >
                        {slide.name}
                      </h3>
                    </div>
                    <p className="text-[15px] leading-[1.6] text-sage sm:text-[16px]">
                      {slide.address}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex w-full flex-col gap-5">
                  {/* Shutter on first reveal; keyed by image so every slide change opens it again. */}
                  <div
                    ref={frameRef}
                    className="relative aspect-[428/272] w-full"
                  >
                    <Shutter
                      key={slide.image}
                      play={frameSeen}
                      className="absolute inset-0"
                    >
                      <div className="relative size-full">
                        <div className="absolute" style={slide.crop}>
                          <Image
                            src={slide.image}
                            alt={slide.name}
                            fill
                            sizes="(min-width: 640px) 460px, 90vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </Shutter>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous project"
                      className="group -m-2.5 flex min-h-11 items-center p-2.5 text-[16px] leading-none text-ink/80"
                    >
                      <Image
                        src="/home/icons/banner-chev-left.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="size-6 -scale-x-100 transition-transform duration-[350ms] ease-out-expo group-hover:-translate-x-[5px]"
                      />
                      {/* Cap-height box so the digit centres on the chevron and the bar, as in Figma. */}
                      <span className="trim w-[9px] tabular-nums">
                        {index + 1}
                      </span>
                    </button>
                    <div className="relative h-[2.5px] w-full max-w-[257px]">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#d1d0cf]" />
                      <motion.span
                        style={{ scaleX: progress }}
                        className="absolute inset-0 origin-left bg-green"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next project"
                      className="group -m-2.5 flex min-h-11 items-center p-2.5 text-[16px] leading-none text-ink/80"
                    >
                      <span className="trim w-[9px] tabular-nums">
                        {slides.length}
                      </span>
                      <Image
                        src="/home/icons/banner-chev-right.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="size-6 transition-transform duration-[350ms] ease-out-expo group-hover:translate-x-[5px]"
                      />
                    </button>
                  </div>
                </div>

                <div className="flex w-full flex-col items-center gap-6">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={slide.href + slide.name}
                      initial={{ opacity: 0.001, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.8, ease: SETTLE }}
                      className="line-clamp-3 text-center text-[15px] leading-[1.6] text-sage sm:text-[16px]"
                    >
                      {slide.copy}
                    </motion.p>
                  </AnimatePresence>
                  <GreenPill href={slide.href} arrow>
                    view project
                  </GreenPill>
                </div>
              </div>
            </Appear>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
