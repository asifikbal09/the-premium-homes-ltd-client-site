"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SETTLE, SPRING, SPRING_SLOW, cn, fluid } from "@/lib/utils";

const SLIDES = [
  { src: "/image/about/about_slide01.png", alt: "TPHL leadership handing over a client agreement", pos: "object-[center_32%]" },
  { src: "/image/about/about_hero03.png", alt: "TPHL milestone celebration under the illuminated logo", pos: "object-[center_16%]" },
  { src: "/image/about/about_slide03.png", alt: "Residential tower on screen with a TPHL director", pos: "object-[center_18%]" },
  { src: "/image/about/about_hero05.png", alt: "TPHL team lunch in the office", pos: "object-[center_18%]" },
];

/*
 * Figma stack, measured on the 1600 frame: the front card is 775 × 473 and each card behind it is
 * smaller and sits higher, so its top edge peeks out. Widths are shares of the front card; tops are
 * shares of the stack's box, 604 tall from the back card's top (y 259) to the front card's foot (y 863).
 */
const TIERS = [
  { width: "100%", top: "21.69%", z: 40, shade: 0 },
  { width: "70.06%", top: "15.73%", z: 30, shade: 0.08 },
  { width: "50.45%", top: "7.12%", z: 20, shade: 0.16 },
  { width: "35.74%", top: "0%", z: 10, shade: 0.24 },
];

const AUTOPLAY_MS = 3200;
const TITLE = "Designed for families. Scaled for tomorrow.";

const pad = (n: number) => String(n).padStart(2, "0");

/** A two-digit figure that rolls to its new value, up when moving forward and down when back. */
function RollingIndex({ value, dir }: { value: number; dir: 1 | -1 }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={value}
          custom={dir}
          variants={{
            enter: (d: number) => ({ y: `${d * 100}%` }),
            center: { y: "0%" },
            exit: (d: number) => ({ y: `${d * -100}%` }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: SETTLE }}
          className="inline-block"
        >
          {pad(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TextButton({ onClick, children, label }: { onClick: () => void; children: string; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="group relative capitalize transition-colors duration-300 hover:text-green">
      {children}
      <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-green transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
    </button>
  );
}

/**
 * The title drifts past as a slow marquee. The stack rises in card by card from the back once in
 * view, then cycles on its own (paused while hovered): the front card steps back to the rear and
 * every other card moves forward one place, growing into its new slot.
 */
export function AboutFamilySlider() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stackRef, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  const go = useCallback((step: 1 | -1) => {
    setDir(step);
    setActive((i) => (i + step + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || !inView || reduce) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, inView, reduce, go]);

  const controls = "font-display font-medium leading-none text-ink";

  return (
    <section aria-label={TITLE} className="relative overflow-hidden bg-warm pb-[clamp(48px,4.8vw,77px)] pt-[clamp(40px,4.4vw,70px)]">
      {/* Title — Figma: K Victor 40 Regular, 144px, running off both edges. */}
      <div aria-hidden className="w-full overflow-hidden">
        <div className="flex w-max will-change-transform" style={{ animation: reduce ? undefined : "marquee 60s linear infinite" }}>
          {[0, 1].map((k) => (
            <span
              key={k}
              className="whitespace-nowrap pr-[0.4em] font-display font-normal capitalize leading-none text-green"
              style={{ fontSize: fluid(144, 56) }}
            >
              {TITLE} {TITLE}
            </span>
          ))}
        </div>
      </div>
      <h2 className="sr-only">{TITLE}</h2>

      <div className="shell relative mt-[clamp(24px,2.8vw,45px)]">
        {/* Stack — the box spans from the back card's top to the front card's foot. */}
        <div
          ref={stackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mx-auto aspect-[775/604] w-full max-w-[775px] lg:w-[48.44%]"
        >
          {SLIDES.map((s, i) => {
            const slot = (i - active + SLIDES.length) % SLIDES.length;
            const tier = TIERS[slot];
            const front = slot === 0;
            return (
              <motion.div
                key={s.src}
                onClick={() => !front && (setDir(1), setActive(i))}
                initial={{ opacity: 0.001, y: 80 }}
                animate={{
                  width: tier.width,
                  top: tier.top,
                  zIndex: tier.z,
                  opacity: inView ? 1 : 0.001,
                  y: inView ? 0 : 80,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        width: SPRING,
                        top: SPRING,
                        zIndex: { duration: 0 },
                        // The first entrance runs back to front.
                        opacity: { duration: 0.6, delay: (3 - slot) * 0.12 },
                        y: { ...SPRING_SLOW, delay: (3 - slot) * 0.12 },
                      }
                }
                drag={front ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -45) go(1);
                  else if (info.offset.x > 45) go(-1);
                }}
                className={cn(
                  "absolute left-1/2 aspect-[775/473] -translate-x-1/2 select-none overflow-hidden rounded-[2.84px] bg-stone-2",
                  front ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                )}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={cn("pointer-events-none object-cover", s.pos)}
                />
                <motion.span
                  aria-hidden
                  animate={{ opacity: tier.shade }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-black"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Counter and controls — Figma: 32px, level with the middle of the front card. */}
        <div
          className={cn(
            controls,
            "mt-6 flex items-center justify-between lg:absolute lg:inset-x-[57px] lg:top-[60.85%] lg:mt-0 lg:-translate-y-1/2",
          )}
          style={{ fontSize: fluid(32, 22) }}
        >
          <p aria-live="polite" className="flex items-center gap-[2.8px]">
            <RollingIndex value={active + 1} dir={dir} />
            <span>/</span>
            <span>{pad(SLIDES.length)}</span>
          </p>
          <div className="flex items-center gap-[11.4px]">
            <TextButton onClick={() => go(-1)} label="Previous slide">
              Prev
            </TextButton>
            <span aria-hidden>/</span>
            <TextButton onClick={() => go(1)} label="Next slide">
              next
            </TextButton>
          </div>
        </div>
      </div>
    </section>
  );
}
